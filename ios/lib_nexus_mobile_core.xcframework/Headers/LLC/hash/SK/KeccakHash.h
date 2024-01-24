/*
The Keccak sponge function, designed by Guido Bertoni, Joan Daemen,
Michaël Peeters and Gilles Van Assche. For more information, feedback or
questions, please refer to our website: http://keccak.noekeon.org/

Implementation by the designers,
hereby denoted as "the implementer".

To the extent possible under law, the implementer has waived all copyright
and related or neighboring rights to the source code in this file.
http://creativecommons.org/publicdomain/zero/1.0/
*/

#ifndef _KeccakHashInterface_h_
#define _KeccakHashInterface_h_

#include <LLC/hash/SK/KeccakSponge.h>

typedef uint8_t BitSequence;
typedef unsigned long long DataLength;
typedef enum { SUCCESS = 0, FAIL = 1, BAD_HASHLEN = 2 } HashReturn;

typedef struct
{
    Keccak_SpongeInstance sponge;
    uint32_t fixedOutputLength;
    uint8_t delimitedSuffix;
} Keccak_HashInstance;

/**
  * Function to initialize the Keccak[r, c] sponge function instance used in sequential hashing mode.
  * @param  hashInstance    Pointer to the hash instance to be initialized.
  * @param  rate        The value of the rate r.
  * @param  capacity    The value of the capacity c.
  * @param  hashbitlen  The desired number of output bits,
  *                     or 0 for an arbitrarily-long output.
  * @param  delimitedSuffix Bits that will be automatically appended to the end
  *                         of the input message, as in domain separation.
  *                         This is a byte containing from 0 to 7 bits
  *                         formatted like the @a delimitedData parameter of
  *                         the Keccak_SpongeAbsorbLastFewBits() function.
  * @pre    One must have r+c=1600 and the rate a multiple of 8 bits in this implementation.
  * @return SUCCESS if successful, FAIL otherwise.
  */
HashReturn Keccak_HashInitialize(Keccak_HashInstance *hashInstance, uint32_t rate, uint32_t capacity, uint32_t hashbitlen, uint8_t delimitedSuffix);

/** Macro to initialize a SHAKE128 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHAKE128(hashInstance)        Keccak_HashInitialize(hashInstance, 1344,  256,   0, 0x1F)

/** Macro to initialize a SHAKE256 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHAKE256(hashInstance)        Keccak_HashInitialize(hashInstance, 1088,  512,   0, 0x1F)

/** Macro to initialize a SHA3-224 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHA3_224(hashInstance)        Keccak_HashInitialize(hashInstance, 1152,  448, 224, 0x06)

/** Macro to initialize a SHA3-256 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHA3_256(hashInstance)        Keccak_HashInitialize(hashInstance, 1088,  512, 256, 0x06)

/** Macro to initialize a SHA3-384 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHA3_384(hashInstance)        Keccak_HashInitialize(hashInstance,  832,  768, 384, 0x06)

/** Macro to initialize a SHA3-512 instance as specified in the FIPS 202 draft.
  */
#define Keccak_HashInitialize_SHA3_512(hashInstance)        Keccak_HashInitialize(hashInstance,  576, 1024, 512, 0x06)

/**
  * Function to give input data to be absorbed.
  * @param  hashInstance    Pointer to the hash instance initialized by Keccak_HashInitialize().
  * @param  data        Pointer to the input data.
  *                     When @a databitLen is not a multiple of 8, the last bits of data must be
  *                     in the least significant bits of the last byte (little-endian convention).
  * @param  databitLen  The number of input bits provided in the input data.
  * @pre    In the previous call to Keccak_HashUpdate(), databitlen was a multiple of 8.
  * @return SUCCESS if successful, FAIL otherwise.
  */
HashReturn Keccak_HashUpdate(Keccak_HashInstance *hashInstance, const BitSequence *data, DataLength databitlen);

/**
  * Function to call after all input blocks have been input and to get
  * output bits if the length was specified when calling Keccak_HashInitialize().
  * @param  hashInstance    Pointer to the hash instance initialized by Keccak_HashInitialize().
  * If @a hashbitlen was not 0 in the call to Keccak_HashInitialize(), the number of
  *     output bits is equal to @a hashbitlen.
  * If @a hashbitlen was 0 in the call to Keccak_HashInitialize(), the output bits
  *     must be extracted using the Keccak_HashSqueeze() function.
  * @param  state       Pointer to the state of the sponge function initialized by Init().
  * @param  hashval     Pointer to the buffer where to store the output data.
  * @return SUCCESS if successful, FAIL otherwise.
  */
HashReturn Keccak_HashFinal(Keccak_HashInstance *hashInstance, BitSequence *hashval);

 /**
  * Function to squeeze output data.
  * @param  hashInstance    Pointer to the hash instance initialized by Keccak_HashInitialize().
  * @param  data        Pointer to the buffer where to store the output data.
  * @param  databitlen  The number of output bits desired (must be a multiple of 8).
  * @pre    Keccak_HashFinal() must have been already called.
  * @pre    @a databitlen is a multiple of 8.
  * @return SUCCESS if successful, FAIL otherwise.
  */
HashReturn Keccak_HashSqueeze(Keccak_HashInstance *hashInstance, BitSequence *data, DataLength databitlen);

#endif
