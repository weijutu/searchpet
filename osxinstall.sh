#! /bin/sh
#
# NAME
#   osxinstall.sh
#
# DESCRIPTION
#   Fix up OS X linker paths in Instant Client 11.2.0.4 and node-oracledb
#   so that DYLD_LIBRARY_PATH does not need to be set at runtime
#
# UNFIN: might be issues with destination path names longer than those hardcoded in the IC libraries.
# You might need to change the export of IC_DIR to a location with a shorter path.

[ `uname -s` != "Darwin" ] && { echo "Error: This script only works on OS X" >& 2; exit 8; }
    
# Set these to the location of your Instant Client 'basic' and 'sdk' packages
IC_BASIC_ZIP=/opt/oracle/instantclient-basic-macos.x64-11.2.0.4.0.zip
IC_SDK_ZIP=/opt/oracle/instantclient-sdk-macos.x64-11.2.0.4.0.zip

[ ! -f $IC_BASIC_ZIP ] && { echo "Error: Cannot find $IC_BASIC_ZIP" >& 2; exit 1; }
[ ! -f $IC_SDK_ZIP ] && { echo "Error: Cannot find $IC_SDK_ZIP" >& 2; exit 2; }

# This is the temporary working directory that the Instant Client ZIP files are extracted into
STAGE_DIR=/tmp/instantclient_stage

# Set the proxy if you are behind a firewall
# Alternatively run 'npm config set https-proxy http://www-proxy.us.oracle.com:80/'
export https_proxy=http://www-proxy.us.oracle.com:80

# These are the hardcoded default paths in the Instant Client 11.2.0.4 libraries that will be changed
IC_DEF1=/ade/b/3071542110/oracle/rdbms/lib
IC_DEF2=/ade/dosulliv_ldapmac/oracle/ldap/lib

# Extract the Instant Client libraries and headers needed by node-oracledb
function extractic()
{
    echo "==> Extracting Instant Client to staging area $STAGE_DIR"
    [ -f $STAGE_DIR -o -d $STAGE_DIR ] && { echo "Error: Remove existing $STAGE_DIR directory and rerun" >& 2; exit 3; }

    mkdir -p $STAGE_DIR

    # Unzip SDK package
    unzip -d $STAGE_DIR $IC_SDK_ZIP > $STAGE_DIR/IC_unzip.log 2>&1
    export IC_UNZIP_NAME=`cd $STAGE_DIR && ls -d instantclient_[0-9]*`
    
    # Needed for 'npm install oracledb'
    export OCI_LIB_DIR=$STAGE_DIR/$IC_UNZIP_NAME
    export OCI_INC_DIR=$STAGE_DIR/$IC_UNZIP_NAME/sdk/include

    # Unzip Basic package
    unzip -d $STAGE_DIR $IC_BASIC_ZIP >> $STAGE_DIR/IC_unzip.log 2>&1

    (cd $STAGE_DIR/$IC_UNZIP_NAME && ln -s libclntsh.dylib.* libclntsh.dylib) # Needed by the node-oracledb installer
}

# Install node-oracledb from NPM
function installnodeoracledb()
{
    export ORCL_NPM_ROOT=`npm root`/oracledb
    echo "==> Installing node-oracledb in $ORCL_NPM_ROOT"

    [ -z "$OCI_INC_DIR" -o ! -f "$OCI_INC_DIR/oci.h" ] && { echo "Error: Cannot find Instant Client headers in $OCI_INC_DIR. Exiting" >&2; exit 4; }
    [ -z "$OCI_LIB_DIR" -o ! -f "$OCI_LIB_DIR/libclntsh.dylib" ] && { echo "Error: Cannot find Instant Client libraries in $OCI_LIB_DIR. Exiting" >&2; exit 5; }

    npm install oracledb
}

# Copy the Instant Client files needed for runtime
function copyclient()
{
    export IC_DIR=$ORCL_NPM_ROOT/instantclient  # the directory to install Instant Client into
    
    echo "==> Copying Instant Client to $IC_DIR"

    mkdir $IC_DIR && cp $STAGE_DIR/$IC_UNZIP_NAME/{libclntsh.dylib.*,libnnz*.dylib,libociei.dylib} $IC_DIR

    [ ! -f "$IC_DIR/libociei.dylib" ] && { echo "Error: $IC_DIR not successfully created" >& 2; exit 6; }
}

# Fix up the linker paths etc in node-oracledb and Instant Client so DYLD_LIBRARY_PATH is not needed
function updatepaths()
{
    # The location of the node-oracledb shared library created by 'npm install oracledb'
    NODE_ORACLEDB_LIB=$ORCL_NPM_ROOT/build/Release/oracledb.node

    echo "==> Updating library paths in $NODE_ORACLEDB_LIB"
    [ ! -f "$NODE_ORACLEDB_LIB" ] && { echo "Error: Cannot find $NODE_ORACLEDB_LIB. Exiting" >&2; exit 7; }

    VER=`ls -l $IC_DIR/libclntsh.dylib.* | awk '{print $NF'} | xargs basename | sed 's/libclntsh.dylib.//'g`
    chmod 755 $IC_DIR/*dylib*
    install_name_tool -id libclntsh.dylib.$VER $IC_DIR/libclntsh.dylib.$VER
    install_name_tool -change $IC_DEF2/libnnz11.dylib $IC_DIR/libnnz11.dylib $IC_DIR/libclntsh.dylib.$VER
    install_name_tool -id libnnz11.dylib $IC_DIR/libnnz11.dylib
    install_name_tool -change $IC_DEF1/libclntsh.dylib.$VER $IC_DIR/libclntsh.dylib.$VER $IC_DIR/libociei.dylib
    install_name_tool -change $IC_DEF1/libclntsh.dylib.$VER $IC_DIR/libclntsh.dylib.$VER $NODE_ORACLEDB_LIB
    chmod 555 $IC_DIR/*dylib*
}

function cleanup()
{
    echo "==> Removing temporary directory $STAGE_DIR"
    rm -rf $STAGE_DIR
}

# These must be run in order
extractic
installnodeoracledb
copyclient
updatepaths
cleanup

# End of script