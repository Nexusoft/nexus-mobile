
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

add_library(lib_nexus SHARED IMPORTED)
set_target_properties(lib_nexus PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_SOURCE_DIR}/android.so)


SET(OPENSSL_ROOT_DIR /usr/local/Cellar/openssl@android/${ANDROID_ABI})

SET(OPENSSL_LIBRARIES_DIR "${OPENSSL_ROOT_DIR}/lib")
SET(OPENSSL_INCLUDE_DIR ${OPENSSL_ROOT_DIR}/include)
SET(OPENSSL_LIBRARIES "ssl" "crypto")


message(${CMAKE_CURRENT_SOURCE_DIR}/android.a)

# build application's shared lib
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++11")
set(CMAKE_SHARED_LINKER_FLAGS "-Wall -v -Wl ")

LINK_DIRECTORIES(${OPENSSL_LIBRARIES_DIR})



add_library(nexusmobilelib SHARED
        entrypoint.cpp)

target_include_directories(nexusmobilelib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/Headers/
        /usr/local/Cellar/openssl@android/${ANDROID_ABI}/include )



target_link_libraries(nexusmobilelib lib_nexus ${OPENSSL_LIBRARIES})

target_link_libraries(nexusmobilelib
        android
        log)
