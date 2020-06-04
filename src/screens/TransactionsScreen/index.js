import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import { Divider } from 'components/Typo';
import Transaction from './Transaction';

const transactions = [
  {
    txid:
      '01e5b21b483c4f0b9bb13104d1c3fbc2933330f93799edba21c5555ec1f053adda822e2a37a650728d575cd900fac39104541afb8b499e7c5590dd1507d2ce45',
    type: 'tritium trust',
    version: 2,
    sequence: 202,
    timestamp: 1591188960,
    blockhash:
      '725dc842d57aa6d9a1c2afa8c5289f741b630b91ac09316e35d1181c090a77319cee0faacc091edc3b75bfedfa4c42fc206912e2c5edbe994f6950105126ee16152547d8235ff98b264d806b424f0692133a920bd8afe2a7253566f11a84a626c0320128a4e6729ce285726670281325ec07d6ae4cb8570a7e4c4a285e7e4512',
    confirmations: 1117,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01f73259676e7691a716e01b62fd8db9180047ec998179a2b7efde9eeff278eb08dbfa3e9985dd042d3a74cc84cac76692c155d6ba9e0d98414e75a75bf17606',
        score: 13636552,
        amount: 2.006988,
      },
    ],
  },
  {
    txid:
      '01f73259676e7691a716e01b62fd8db9180047ec998179a2b7efde9eeff278eb08dbfa3e9985dd042d3a74cc84cac76692c155d6ba9e0d98414e75a75bf17606',
    type: 'tritium trust',
    version: 2,
    sequence: 201,
    timestamp: 1591118742,
    blockhash:
      '1af9790af1ebe8e981256e4b909ec8aee262b7c9e010af03f3d13da8dec637b36d9d6aa4836ef77643ba2fc9399430793d654f9c892bac3456d2aabfd9c0d76b688b5f859103ffb320f8f143b927d43aee1af3f77baf08b85bff5ea53cab68eb7271dedceb235335a07c689f45d86e2976d329ecf8306882b8b4e7023dd07a03',
    confirmations: 2409,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01a870a1278c014cc11bbf1a27b114a16167c3253ffef801ac784d580e0c4e0f4debb506911d60329aa41ae3df67e9bb85bfd1660948f06f3ad87ef31de3342d',
        score: 13566394,
        amount: 0.635126,
      },
    ],
  },
  {
    txid:
      '01a870a1278c014cc11bbf1a27b114a16167c3253ffef801ac784d580e0c4e0f4debb506911d60329aa41ae3df67e9bb85bfd1660948f06f3ad87ef31de3342d',
    type: 'tritium trust',
    version: 2,
    sequence: 200,
    timestamp: 1591096471,
    blockhash:
      '845534e57786669c5095bbfd68f33149c6a0ee190e1d957ef7bc0c293250d68be3935e12c1e4cf6c03fb16d50884544bf75bc2ff086b2adceeb1655fc0f20eac677dc7853ecaa587648027330de0440e6f00ee35b410ea5c0252592219fbb145ecc8a58647b3d04b73342b31d02b49f0f7a219b1758e34e33c3dd27bb03a235c',
    confirmations: 2825,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '0170762eda69545b7e493e2d8ff9d46ea207e0a49739daa3ac017dae11908ec988b1caf6b502784b11ba34ca7bb90d34ac166db336bf0217b189b2f48faf672c',
        score: 13544195,
        amount: 2.526767,
      },
    ],
  },
  {
    txid:
      '0170762eda69545b7e493e2d8ff9d46ea207e0a49739daa3ac017dae11908ec988b1caf6b502784b11ba34ca7bb90d34ac166db336bf0217b189b2f48faf672c',
    type: 'tritium trust',
    version: 2,
    sequence: 199,
    timestamp: 1591007909,
    blockhash:
      'b42140571d7ffb67ee8ac240b1085a9d775e2d93fed6ac0b7c88962618e972060d8a9494f80bd37a826b43d31c0ac5b8f88fd3ee621614f8a4c707b6edba300f0dcaa47932695ab7dc1fd1ef1ad70905a21e52275f00a51a6a8d96682f39e5640e6e289f6471db8e2a49bf0ba4bb8e8c311f2d17816f0772cb2b1d292a7a444e',
    confirmations: 4483,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01eec5fdeccd79e39a4da55781bf7701931197d52330141f76cb3bb8dcec4e5f973e6a9e3a8d564dca979a921e7a1e8c382b81abed3f0c12453b36bf85dac5d2',
        score: 13455665,
        amount: 6.857228,
      },
    ],
  },
  {
    txid:
      '01eec5fdeccd79e39a4da55781bf7701931197d52330141f76cb3bb8dcec4e5f973e6a9e3a8d564dca979a921e7a1e8c382b81abed3f0c12453b36bf85dac5d2',
    type: 'tritium trust',
    version: 2,
    sequence: 198,
    timestamp: 1590766837,
    blockhash:
      'a5d77b390ea2899810f362faee1f17dcd5a9a366db9258538860bdcbec6ab311880b9f39ee398f812962481d1e403ecc1ae41a8a03654463c09af18dbadda87af026111c08b840fffd025a80ea1a1ce2526fbdf17edb771b90551e166f2e3583d69f3753f9d2de3bfff0ba36927e03dcb9531c475f7ad7cd4bb403ee70588197',
    confirmations: 9071,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01f1a1526664294e49e1a0e0e6d6fb0a4b63ac32f156d10d0ce356c6a8712abb369a2327ece2c66e8dda30d54e352f7c41cff8e61b2a970ab3a633f01e7d34a8',
        score: 13214629,
        amount: 1.39445,
      },
    ],
  },
  {
    txid:
      '01f1a1526664294e49e1a0e0e6d6fb0a4b63ac32f156d10d0ce356c6a8712abb369a2327ece2c66e8dda30d54e352f7c41cff8e61b2a970ab3a633f01e7d34a8',
    type: 'tritium trust',
    version: 2,
    sequence: 197,
    timestamp: 1590717455,
    blockhash:
      '41a352c734fd76ce72ea3faa39142a486b5ad766face4dabc7a2bbcd0fa9e5cd4f0398398e4cbc90622c9334590f04b46c5f90d6ab376efe49924e89d20b14e8d45c38ddbb5bae8f73aeecb27a64097f2094be08ae62d0883f96718e8fb1948878188e6570e1c0a9a514ee238aa15699112b75bbbafc46b8a1986e7c71ed1983',
    confirmations: 10019,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '0185692c2dc8df449679a34c7eeb91c408d473e2164315a59a544c4078b8dda8963bc60a9bda712435dd86cddef3377b730cf7c2ef5bbadb67cff22ffabb285f',
        score: 13165296,
        amount: 5.647895,
      },
    ],
  },
  {
    txid:
      '0185692c2dc8df449679a34c7eeb91c408d473e2164315a59a544c4078b8dda8963bc60a9bda712435dd86cddef3377b730cf7c2ef5bbadb67cff22ffabb285f',
    type: 'tritium trust',
    version: 2,
    sequence: 196,
    timestamp: 1590517168,
    blockhash:
      '85a6118339b8b5d803140cb8f711f71cfea186ebcd45b37b5217d6290a5fdff6b9f35a4a26dcbff738d147eaf28780e21002bcaf0554b45ef79644cb1a6a03e2015ab2123a4ff7bfbd4f5c24d94b41b7b24798ceb631707112ff5cffb8d4d8b05cccd6201fff1df9fd35072a0dfdb4535ea6e8b35f5ffb6bf6290e3180e16b32',
    confirmations: 13771,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01a2cd2ca95c2d42a8e90fc254fb907666b5feb473d5c017a73861885ab046842f3119f97840dde0704ae19f6fc7b7398f5642b38e48eca42193cbbf039f9f93',
        score: 12965094,
        amount: 3.059162,
      },
    ],
  },
  {
    txid:
      '01a2cd2ca95c2d42a8e90fc254fb907666b5feb473d5c017a73861885ab046842f3119f97840dde0704ae19f6fc7b7398f5642b38e48eca42193cbbf039f9f93',
    type: 'tritium trust',
    version: 2,
    sequence: 195,
    timestamp: 1590408116,
    blockhash:
      'ead9adb6b68f9836877f96aaf4940e03c135584c6fd2d6c7affdf666dc648a3fe0211f7244bf9fd00e2db834c4c99c3fe7dbcb65e2c5d8b6812d1dca06182df4b93b776eda5e4b8755bb9ed58f499544b11705dc6664ad93dcc855e1595a98fc99b0daeec9feca21d51934413919a833249596adb90c9b756776538a4083adeb',
    confirmations: 15847,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '01b3a04d4e88033b9593842b053e488cb503a20c13bbfd241b8813bfd13ff9bdc7fccd6867744cfe8320aa7effdc9bcf8ead5635e35a6068ed982d2346024166',
        score: 12856064,
        amount: 7.102727,
      },
    ],
  },
  {
    txid:
      '010ae7ff6764f9e4a70de4022b599280bcb5043a6b4f8838f4771fe15cb8c259ebc13049e7296bf0151ccb9c28029550befd34b02d2daf20b3587227cf4d694c',
    type: 'tritium trust',
    version: 1,
    sequence: 2,
    timestamp: 1573594475,
    blockhash:
      'e83eecc99c3732f596a5a6b9708ddd9738ab31df659701963d31d4e7ae2608b5d401812cf3e63ca2d4c581bfa7a4f81866f05e571f370f76003dbdd016a04205d6b2e58720710823ce1bf40923d18fcbec39d5d6633392ffd1a42a88440a7f12f2a547740bbedd04d8144e5cbd0caff7d85933e2710eaefc671c1fdb92fdf704',
    confirmations: 332681,
    contracts: [
      {
        id: 0,
        OP: 'TRUST',
        last:
          '7a14e057f9d8445ffaf31834ab76aa96f6874a335b6a954cb34f52ea8bd7b0e31288691501388ff0df2e009a1c6ccc02b6fda28f8426e6414e5eff49b56a9dd7',
        score: 549849,
        amount: 2.924051,
      },
    ],
  },
  {
    txid:
      '016f2692f675a117bac841138fe12674357121d7a907c97c2978a875633e096a4f15b8e5a562d05ced6615c5cd1396c1a1ea918b8ffbd5332fdddea4c317fad2',
    type: 'tritium user',
    version: 1,
    sequence: 1,
    timestamp: 1573583188,
    blockhash:
      'f821654d1fbf4be2e855bd4590bbab49dce0d547e60a440fe6e727a56f45c2c635cc222862124d0e3eab04aff082e3ec5a1ee4b58a9a2c9f4942bd0fa75030ade6fe07cfe8a14437194300905670407b7d820b5fc269ac4f8bd521b4bd38c5e5b9daaff84f23e7ca3c1c40459d95b024188f65ec375c1c56c63bef7594ddb183',
    confirmations: 332802,
    contracts: [
      {
        id: 0,
        OP: 'MIGRATE',
        txid:
          '02958dddc9456d9447711cd6c5d3e2931c437b1357e0b3d6f759b26d79efae436ac2148777cb380039ab316eadc7adc97baf65b572f3133c2ec1f086b884c239',
        account: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
        account_name: 'trust',
        trustkey: '2RS2pCkSMQfewEW3jV4X6iVga6nk7hJ7RxuxsrC6fWbYvsxrJYt',
        amount: 34888.687569,
        score: 972378,
        hashLast:
          '7a14e057f9d8445ffaf31834ab76aa96f6874a335b6a954cb34f52ea8bd7b0e31288691501388ff0df2e009a1c6ccc02b6fda28f8426e6414e5eff49b56a9dd7',
      },
    ],
  },
  {
    txid:
      '0182edbf532843cf6f52e6f911d9fa13f5ea32a3b26ab32815326ad1121890a2668603648ab5fc29176e2395f24cc1bffda4b66cd8a88f39fb93ba0e9bb63842',
    type: 'tritium first',
    version: 1,
    sequence: 0,
    timestamp: 1573539403,
    blockhash:
      '9e804d2d1e1d3f64629939c6f405f15bdcf8cd18688e140a43beb2ac049333a230d409a1c4172465b6642710ba31852111abbd81e554b4ecb122bdfeac9f73d4f1570b6b976aa517da3c1ff753218e1ba940a5225b7366b0623e4200b8ea97ba09cb93be7d473b47b5aa75b593ff4b8ec83ed7f3d1b642b9bba9e6eda653ead9',
    confirmations: 332850,
    contracts: [
      {
        id: 0,
        OP: 'CREATE',
        address: '8JYgwJKJzva7eBvXtV9e2KL3w4Go7xodXNs1WtQbPfahK8wSzQ1',
        type: 'OBJECT',
        object_type: 'NAME',
        data:
          '096e616d6573706163650800046e616d65080574727573740761646472657373ff05cfab66e3f818f3faa90920de73e7c63b4424a27d44892f942ccb38edddb2b2d8',
      },
      {
        id: 1,
        OP: 'CREATE',
        address: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
        type: 'OBJECT',
        object_type: 'TRUST',
        data:
          '0762616c616e6365ff040000000000000000057472757374ff040000000000000000057374616b65ff04000000000000000005746f6b656e050000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        id: 2,
        OP: 'CREATE',
        address: '8HJcRyUftAbVPCN3AQxVVFy8JBwZiGhBpfbCr5yyDfUzKiiiMsm',
        type: 'OBJECT',
        object_type: 'NAME',
        data:
          '096e616d6573706163650800046e616d65080764656661756c740761646472657373ff059599c429270f3d551913e996ca3f89693b28be12839becbd860c02bfbe597cd6',
      },
      {
        id: 3,
        OP: 'CREATE',
        address: '8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW',
        type: 'OBJECT',
        object_type: 'ACCOUNT',
        data:
          '0762616c616e6365ff04000000000000000005746f6b656e050000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        id: 4,
        OP: 'CREATE',
        address: '89sbQVkEmMtdcZPVmVw958kqi5DP8fCHUndPBLFz6yHGq8wEmAq',
        type: 'OBJECT',
        object_type: 'CRYPTO',
        data:
          '0461757468ff05fe25f2317c0656e02423e292abf8041b9bac02f460c0b218e341f38bb32c1602046c697370ff050000000000000000000000000000000000000000000000000000000000000000076e6574776f726bff0544243850a48377363b26c6a15e7067b5a12c31a7a353d12120b4c941f0c19d02047369676eff0511b924e4e2f45e9287bd370900fc0b6b4f93468b28e481c4bdd2a7c50e8ab00206766572696679ff0500000000000000000000000000000000000000000000000000000000000000000463657274ff0500000000000000000000000000000000000000000000000000000000000000000461707031ff0500000000000000000000000000000000000000000000000000000000000000000461707032ff0500000000000000000000000000000000000000000000000000000000000000000461707033ff050000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
  },
];

const Wrapper = styled(ScrollView)({
  flex: 1,
  // paddingVertical: 30,
});

export default function TransactionsScreen() {
  return (
    <Wrapper>
      {transactions.map((tx, i) => (
        <React.Fragment key={tx.txid}>
          <Divider />
          <Transaction transaction={tx} />
        </React.Fragment>
      ))}
    </Wrapper>
  );
}
