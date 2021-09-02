
#
# Copyright (C) The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

cmake_minimum_required(VERSION 3.4.1)

# configure import libs
set(distribution_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../../../distribution)

# Sets target to be built by MAKE
add_library(lib_nexus SHARED IMPORTED)

# Search OpenSSL using find_package, will search for OpenSSL in standard Directories
find_package(OpenSSL QUIET)

if( OPENSSL_FOUND )
    message(STATUS "Using OpenSSL ${OPENSSL_VERSION}")
else()
    # Build.gradle will pass openssl.dir IF supplied in the local.properties.
    if(${OPENSSL_ROOT_DIR} MATCHES null)
        # Can not auto find OpenSSL or not supplied with dir, use hardcoded input.
        # Keep ANDROID_ABI but set this to the location of your built openssl for android
        SET(OPENSSL_ROOT_DIR /usr/local/Cellar/openssl@android/${ANDROID_ABI})
    else()
        # Use dir supplied with local.properties
        SET(OPENSSL_ROOT_DIR ${OPENSSL_ROOT_DIR}/${ANDROID_ABI})
    endif()
    SET(OPENSSL_INCLUDE_DIR ${OPENSSL_ROOT_DIR}/include)
endif()

# Depending on the build ABI use the specific compiled c project
if(${ANDROID_ABI} MATCHES x86_64)
    set_target_properties(lib_nexus PROPERTIES IMPORTED_LOCATION
            ${CMAKE_CURRENT_SOURCE_DIR}/Nexus.androidframework/x86_64-android-nexuslib.so)
elseif(${ANDROID_ABI} MATCHES arm64-v8a)
    set_target_properties(lib_nexus PROPERTIES IMPORTED_LOCATION
            ${CMAKE_CURRENT_SOURCE_DIR}/Nexus.androidframework/arm64-v8a-android-nexuslib.so)
else()
    set_target_properties(lib_nexus PROPERTIES IMPORTED_LOCATION
            ${CMAKE_CURRENT_SOURCE_DIR}/Nexus.androidframework/x86_64-android-nexuslib.so)
endif()


# Set openssl consts
string(REPLACE "include" "lib" OPENSSL_LIBRARIES_DIR ${OPENSSL_INCLUDE_DIR})
SET(OPENSSL_LIBRARIES "ssl" "crypto")

# build application's shared lib
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")
set(CMAKE_SHARED_LINKER_FLAGS "-Wall -v -Wl ")

# Link openssl to project
LINK_DIRECTORIES(${OPENSSL_LIBRARIES_DIR})

# Add main entry point to library
add_library(nexusmobilelib SHARED
        entrypoint.cpp)

# Add all includes to MAKE
target_include_directories(nexusmobilelib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/Nexus.androidframework/Headers/
        ${OPENSSL_INCLUDE_DIR} )

# Add specific openssl libs to MAKE
target_link_libraries(nexusmobilelib lib_nexus ${OPENSSL_LIBRARIES})

# Build Target
target_link_libraries(nexusmobilelib
        android
        log)
