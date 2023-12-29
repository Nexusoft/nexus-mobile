/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <vector>
#include <limits.h>
#include <cstdint>

#include <LLP/include/version.h>

#include <Util/templates/datastream.h>
#include <Util/include/debug.h>

namespace LLP
{
    /** MessagePacket
     *
     *  Class to handle sending and receiving of More Complex Message LLP Packets.
     *
     *  Components of a Message LLP Packet.
     *  BYTE 0 - 1  : Message Code
     *  BYTE 2 - 6  : Packet Length
     *  BYTE 7 - 10 : Packet Checksum
     *  Byte 11 +   : Packet Data
     *
     **/
    class MessagePacket
    {
    public:
        /* Message typedef. */
        typedef uint16_t message_t;


        /* Message enumeration. */
        uint16_t       MESSAGE;


        /* Flags to determine packet information. */
        uint16_t       FLAGS;


        /* Size of the packet. */
        uint32_t	   LENGTH;


        /* Binary data of the packet. */
        std::vector<uint8_t> DATA;


        /** Default Constructor **/
        MessagePacket()
        : MESSAGE (0)
        , FLAGS   (0)
        , LENGTH  (0)
        , DATA    ( )
        {
        }


        /** Copy Constructor **/
        MessagePacket(const MessagePacket& packet)
        : MESSAGE (packet.MESSAGE)
        , FLAGS   (packet.FLAGS)
        , LENGTH  (packet.LENGTH)
        , DATA    (packet.DATA)
        {
        }


        /** Move Constructor **/
        MessagePacket(MessagePacket&& packet) noexcept
        : MESSAGE (std::move(packet.MESSAGE))
        , FLAGS   (std::move(packet.FLAGS))
        , LENGTH  (std::move(packet.LENGTH))
        , DATA    (std::move(packet.DATA))
        {
        }


        /** Copy Assignment Operator **/
        MessagePacket& operator=(const MessagePacket& packet)
        {
            MESSAGE = packet.MESSAGE;
            FLAGS   = packet.FLAGS;
            LENGTH  = packet.LENGTH;
            DATA    = packet.DATA;

            return *this;
        }


        /** Move Assignment Operator **/
        MessagePacket& operator=(MessagePacket&& packet) noexcept
        {
            MESSAGE = std::move(packet.MESSAGE);
            FLAGS   = std::move(packet.FLAGS);
            LENGTH  = std::move(packet.LENGTH);
            DATA    = std::move(packet.DATA);

            return *this;
        }


        /** Destructor. **/
        ~MessagePacket()
        {
            std::vector<uint8_t>().swap(DATA);
        }


        /** Constructor **/
        MessagePacket(const message_t nMessage)
        {
            SetNull();

            MESSAGE = nMessage;
        }


        /** Serialization **/
        IMPLEMENT_SERIALIZE
        (
            READWRITE(MESSAGE);
            READWRITE(FLAGS);
            READWRITE(LENGTH);
        )


        /** SetNull
         *
         *  Set the Packet Null Flags.
         *
         **/
        void SetNull()
        {
            MESSAGE   = 0;
            FLAGS     = 0;
            LENGTH    = 0;

            DATA.clear();
        }


        /** IsNull
         *
         *  Packet Null Flag. Length and Checksum both 0.
         *
         **/
        bool IsNull() const
        {
            return (MESSAGE == 0 && LENGTH == 0 && DATA.size() == 0);
        }


        /** Complete
         *
         *  Determine if a packet is fully read.
         *
         **/
        bool Complete() const
        {
            return (Header() && static_cast<uint32_t>(DATA.size()) == LENGTH);
        }


        /** Header
         *
         *  Determine if header is fully read
         *
         **/
        bool Header() const
        {
            return IsNull() ? false : (MESSAGE != 0 && LENGTH > 0);
        }


        /** SetLength
         *
         *  Sets the size of the packet from Byte Vector.
         *
         *  @param[in] vBytes the byte buffer to set the length of.
         *
         **/
        void SetLength(const std::vector<uint8_t>& vBytes)
        {
            DataStream ssLength(vBytes, SER_NETWORK, MIN_PROTO_VERSION);
            ssLength >> LENGTH;
        }


        /** SetData
         *
         *  Set the Packet Data.
         *
         *  @param[in] ssData The datastream with the data to set.
         *
         **/
        void SetData(const DataStream& ssData)
        {
            LENGTH = static_cast<uint32_t>(ssData.size());
            DATA   = ssData.Bytes();
        }


        /** IsValid
         *
         *  Check the Validity of the Packet.
         *
         **/
        bool IsValid() const
        {
            /* Check that the packet isn't nullptr. */
            if(IsNull())
                return false;

            /* Make sure Packet length is within bounds. (Max 2 MB Packet Size) */
            if(LENGTH > (1024 * 1024 * 2))
                return debug::error("Tritium Packet (", MESSAGE, ", ", LENGTH, " bytes) : Message too Large");

            return true;
        }


        /** GetBytes
         *
         *  Serializes class into a Byte Vector. Used to write Packet to Sockets.
         *
         *  @return Returns the serialized byte vector.
         *
         **/
        std::vector<uint8_t> GetBytes() const
        {
            DataStream ssHeader(SER_NETWORK, MIN_PROTO_VERSION);
            ssHeader << *this;

            std::vector<uint8_t> vBytes(ssHeader.begin(), ssHeader.end());
            vBytes.insert(vBytes.end(), DATA.begin(), DATA.end());

            return vBytes;
        }
    };
}
