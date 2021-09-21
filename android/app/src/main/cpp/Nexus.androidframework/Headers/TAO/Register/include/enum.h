/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_REGISTER_INCLUDE_ENUM_H
#define NEXUS_TAO_REGISTER_INCLUDE_ENUM_H

/* Global TAO namespace. */
namespace TAO
{

    /* Register Layer namespace. */
    namespace Register
    {

        /** REGISTER
         *
         *  State registers that are available for use.
         *
         **/
        namespace REGISTER
        {
            enum
            {
                /* RESERVED can't be used as an object. */
                RESERVED   = 0x00,

                /* This type of register cannot have the data changed */
                READONLY   = 0x01,

                /* This type of register can only be appended to. */
                APPEND     = 0x02,

                /* This type of register is just raw data that can be changed. */
                RAW        = 0x03,

                /* This type of register has its data fields enforced by operations layer. */
                OBJECT     = 0x04,

                /* This type of register is special and for system update only. */
                SYSTEM     = 0x05,
            };
        }


        /** SYSTEM
         *
         *  System registers with reserved indexes.
         *
         **/
        namespace SYSTEM
        {
            enum
            {
                /* RESERVED can't be used as system register. */
                RESERVED  = 0x00,

                /* This type of register is a system register holding global trust. */
                TRUST     = 0x01,

                /* LIMIT is defined as 256 values. */
                LIMIT     = 0xff
            };
        }


        /** OBJECT
         *
         *  Object registers that are available and standardized.
         *
         **/
        namespace OBJECTS
        {
            enum
            {
                /* Non-Standard Object (User Defined Type). */
                NONSTANDARD  = 1,

                /* Account Object Register. */
                ACCOUNT      = 2,

                /* Token Object Register. */
                TOKEN        = 4,

                /* Trust Object Register. */
                TRUST        = 8,

                /* Name Object Register. */
                NAME         = 16,

                /* Namespace Object Register. */
                NAMESPACE    = 32,

                /* Crypto Object Register. */
                CRYPTO       = 64
            };
        }


        /** Object register data types. **/
        namespace TYPES
        {
            enum
            {
                UNSUPPORTED = 0x00,

                //RESERVED to 0x0f
                UINT8_T     = 0x01,
                UINT16_T    = 0x02,
                UINT32_T    = 0x03,
                UINT64_T    = 0x04,
                UINT256_T   = 0x05,
                UINT512_T   = 0x06,
                UINT1024_T  = 0x07,
                STRING      = 0x08,
                BYTES       = 0x09,

                //by default everything is read-only
                MUTABLE     = 0xff
            };
        }


        /** STATES
         *
         *  The states for the register script in transaction.
         *
         **/
        namespace STATES
        {
            enum
            {
                /* RESERVED can't be used as a state. */
                RESERVED   = 0x00,

                /* Pre-State - for marking register as a pre-state in register scripts. */
                PRESTATE   = 0x01,

                /* Post-State - for recording the checksum of register post-state. */
                POSTSTATE  = 0x02
            };
        }

        /** NAMESPACE
         *
         *  The NAMESPACE namespace to hold constants for Namespace Object registers
         *
         **/
        namespace NAMESPACE
        {
            /* Constant used to indicate a global namespace */
            const std::string GLOBAL = "~GLOBAL~";
        }
    }
}

#endif
