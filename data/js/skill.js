/*[]--------------------------------------------------------------------------------------------[]*/
/*| 変数宣言                                                                                     |*/
/*[]--------------------------------------------------------------------------------------------[]*/
var tmpcode = "";                                /*[]-- テンポラリー                          --[]*/

/*[]--------------------------------------------------------------------------------------------[]*/
/*| HTMLファイル名(拡張子なし) 取得                                                              |*/
/*[]--------------------------------------------------------------------------------------------[]*/
// 現在のページの全アドレスを取得
job = document.location.href;
// アドレスに「?」があった場合、「?」より前のアドレスを切取る
if (job.indexOf("?") != -1) {
  job = job.substring(0,job.indexOf("?"));
}
// HTMLファイル名(拡張子なし)を取得する
job = job.substring(job.lastIndexOf("/")+1,job.lastIndexOf("/")+4);

/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキルバー初期化                                                                             |*/
/*[]--------------------------------------------------------------------------------------------[]*/
var bar = new Array(11);
bar[0]  = new Image();  bar[0].src  = "../../data/other/10-0.png";
bar[1]  = new Image();  bar[1].src  = "../../data/other/10-1.png";
bar[2]  = new Image();  bar[2].src  = "../../data/other/10-2.png";
bar[3]  = new Image();  bar[3].src  = "../../data/other/10-3.png";
bar[4]  = new Image();  bar[4].src  = "../../data/other/10-4.png";
bar[5]  = new Image();  bar[5].src  = "../../data/other/10-5.png";
bar[6]  = new Image();  bar[6].src  = "../../data/other/10-6.png";
bar[7]  = new Image();  bar[7].src  = "../../data/other/10-7.png";
bar[8]  = new Image();  bar[8].src  = "../../data/other/10-8.png";
bar[9]  = new Image();  bar[9].src  = "../../data/other/10-9.png";
bar[10] = new Image();  bar[10].src = "../../data/other/10-10.png";

/*[]--------------------------------------------------------------------------------------------[]*/
/*| 画面初期化                                                                                   |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function Init() {
    document.Msg.chrName.value = "";             /*[]-- 名前                                  --[]*/
    latestSlotNum              = 0;              /*[]-- スロット番号                          --[]*/
    tmp = document.cookie;                       /*[]-- クッキーの値                          --[]*/
    // クッキーの値がある場合
    if(tmp != ""){
        tmp = "; " + tmp;
        // 「; sekai_swd_」が含まれている場合
        if( tmp.lastIndexOf("; sekai_" + job + "_") != -1 ) {
            // スロット番号取得(1～5)
            latestSlotNum = tmp.charAt(tmp.lastIndexOf("; sekai_" + job + "_") + 12);
        }
        // 「slot1」～「slot5」の場合
        if( location.search.substring(1).match("slot[1-5]$") ) {
            // スロット番号取得(1～5)
            latestSlotNum = location.search.charAt(5);
        }
    }

    // スロット番号1～5の場合
    if( latestSlotNum > 0 && latestSlotNum <= 5 ) {
        // セーブSlotコンボ設定
        document.Msg.Slot.value = latestSlotNum;
    }

    // クッキーからロード
    if( !location.search.substring(1) || location.search.substring(1).match("slot[1-5]$") ){
        Load("cookie");
    }

    // Saveスロット数分クッキーから値を取得
    for( idx = 1; idx <= document.Msg.Slot.options.length; idx++ ) {
        // クッキーのキーを設定
        key = "sekai_" + job + "_" + idx;
        // クッキーから値を取得できた場合
        if( getCookie(key) ) {
            // 「&」で分割できた場合
            if( getCookie(key).split("&")[1] ) {
                // 「Slotx : MMMMM」
                document.Msg.Slot.options[ idx - 1 ].text = "Slot" + idx + " : " + unescape(getCookie(key).split("&")[1]);
            }
            // 「&」で分割できず空白の場合
            if( !(getCookie(key).split("&")[1]) || getCookie(key).split("&")[1] == "" ) {
                // 「Slotx : no Name」
                document.Msg.Slot.options[ idx - 1 ].text = "Slot" + idx + " : no Name";
            }
        }
        // クッキーから値を取得できなかった場合
        if( !(getCookie(key)) ) {
            // 「Slotx : no Save Data」
            document.Msg.Slot.options[ idx - 1 ].text = "Slot" + idx + " : no Save Data";
        }
    }

}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| クッキーから値取得                                                                           |*/
/*|                                                                                              |*/
/*|   引数  ：key クッキーのキー                                                                 |*/
/*|   戻り値：クッキーの値（なしの場合空文字）                                                   |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function getCookie(key) {
    tmp1 = " " + document.cookie + ";";
    xx1 = xx2 = 0;
    len = tmp1.length;

    while(xx1 < len){
        xx2 = tmp1.indexOf(";", xx1);
        tmp2 = tmp1.substring(xx1 +1, xx2);
        xx3 = tmp2.indexOf("=");
        if(tmp2.substring(0, xx3) == key){
            // クッキーの値を返却
            return(unescape(tmp2.substring(xx3 +1, xx2 - xx1 -1)));
        }
        xx1 = xx2 +1;
    }
    // クッキーの値なし
    return("");
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| クッキーからロードする                                                                       |*/
/*|                                                                                              |*/
/*|   引数  ：mode クッキーのモード                                                              |*/
/*|   戻り値：クッキーの値                                                                       |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function loadType(mode) {
    code = "";

    if (mode == "cookie") {
        // 選択されたスロット番号
        num = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
        // クッキーのキー：「selai_swd_x」
        key = "sekai_" + job + "_" + num;
        // クッキーから値を取得できた場合
        if( getCookie(key) ) {
            code = getCookie(key).split("&")[0];
            // 名前を取得
            name = unescape(getCookie(key).split("&")[1])
            setAlertLayer("クッキーからロードします。Slot" + num, 1);
            // 名前にセット
            document.Msg.chrName.value = name;
        }
    }

    if (mode == "tmp") {
        code = tmpcode;
    }

    return code;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| クッキーにセーブする                                                                         |*/
/*|                                                                                              |*/
/*|   引数  ：code デコードされた保存値                                                          |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function SaveCookie(code) {
    // 選択されたスロット番号
    num = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
    // スロット名(Slot1～Slot5)
    slotname = (document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text).split(" : ")[1];

    // 名前が空の場合
    if(document.Msg.chrName.value == "") {
        slotname = "no Name";
    }
    // 名前が空でない場合
    else{
        // 「:」「&」を「：」「＆」に変換する
        slotname = (document.Msg.chrName.value).replace(/:/g,"：");
        slotname = (document.Msg.chrName.value).replace(/&/g,"＆");
    }
    // スロット名編集
    document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text = "Slot" + num + " : " + slotname;

    // クッキー編集
    tmp = "sekai_" + job + "_" + num + "=" + code + "&" + escape(slotname) + "; expires=Fri, 31-Dec-2000 23:59:59; ";
    document.cookie = tmp;
    tmp = "sekai_" + job + "_" + num + "=" + code + "&" + escape(slotname) + "; expires=Fri, 31-Dec-2030 23:59:59; ";
    document.cookie = tmp;
    setAlertLayer("Slot" + num + " にセーブしました。", 1);
    // 名前に設定
    document.Msg.chrName.value = slotname;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| オプション設定                                                                               |*/
/*|                                                                                              |*/
/*|   引数  ：txt   メッセージ                                                                   |*/
/*|           close 1以上   ：onclickを付与する                                                  |*/
/*|                 上記以外：onclickを付与しない                                                |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function setAlertLayer(txt,close) {
    // option1 の設定
    document.getElementById("option1").style.height              = '600px';
    document.getElementById("option1").style.width               = '800px';

    if( navigator.userAgent.indexOf('MSIE') > 0 && navigator.userAgent.indexOf('Opera') < 0 ) {
        document.getElementById("option1").style.backgroundImage = 'url(../../data/other/black.png)';
    } else {
        document.getElementById("option1").style.backgroundImage = 'url(../../data/other/alpha.png)';
    }
    document.getElementById("option1").style.filter              = "Alpha(opacity=30)";
    document.getElementById("option1").style.border              = "0px";

    // option2 の設定
    document.getElementById("option2").style.height              = '200px';
    document.getElementById("option2").style.width               = '400px';
    document.getElementById("option2").style.top                 = '200px';
    document.getElementById("option2").style.left                = '200px';

    document.getElementById("option2").style.backgroundColor     = '#bbddff';
    document.getElementById("option2").style.color               = '#333333';
    document.getElementById("option2").style.border              = '0px';
    document.getElementById("option2").style.padding             = '0px';

    tmpMsg = "<table width=100% height=95% border=0";
    if(close) tmpMsg += " onclick='JavaScript:offOptionLayer();'";
    tmpMsg += "><tr><td align=center><div class='alert'>\n" + txt + "</div></td></tr></table>";

    document.getElementById("option2").innerHTML = tmpMsg;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| オプション設定クリア                                                                         |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function offOptionLayer() {
    // option1 の設定
    document.getElementById("option1").style.height = '0px';
    document.getElementById("option1").style.width  = '0px';

    // option2 の設定
    document.getElementById("option2").style.height = '0px';
    document.getElementById("option2").style.width  = '0px';
    document.getElementById("option2").style.top    = '0px';
    document.getElementById("option2").style.left   = '0px';

    // 空白を設定
    document.getElementById("option1").innerHTML    = "";
    document.getElementById("option2").innerHTML    = "";
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| Slot削除(cookie版)                                                                           |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function DeleteCookie() {
    // 選択されたスロット番号
    num = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
    // 削除対象
    target = "sekai_" + job + "_" + num;

    setAlertLayer("<br><br><br><br>本当にセーブデータを削除しますか？<br><br><br><br>"
        + "<form><input type='button' value='　OK　' onclick='DeleteCookie2();'>　　"
        + "<input type='button' value='CANSEL' onclick='offOptionLayer();'></form>",0);
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| Slot削除(cookie版)                                                                           |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function DeleteCookie2() {
    // 削除
    document.cookie = target + "=0; expires=Fri, 31-Dec-2000 23:59:59; ";
    // スロット名設定
    document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text = "Slot" + num + " : no Save Data";
    setAlertLayer("セーブデータを削除しました。",1);
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| 以下各スキルHTMLから呼ばれる関数                                                             |*/
/*[]--------------------------------------------------------------------------------------------[]*/


/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキルポイント                                                                               |*/
/*|                                                                                              |*/
/*|   引数  ：lv    スキルポイント                                                               |*/
/*|           max   スキルポイントMAX                                                            |*/
/*|           skill imgタグのスキル名                                                            |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function Point(lv, max, skill) {
    if(document.images){
        document.images[skill].src = bar[lv].src;
    }
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキル不活性                                                                                 |*/
/*|                                                                                              |*/
/*|   引数  ：parts スキル名                                                                     |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function Disable(parts){
    document.getElementById(parts).style.backgroundColor = '#bfafcf';
    document.getElementById(parts).style.color = '#333333';
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキル活性                                                                                   |*/
/*|                                                                                              |*/
/*|   引数  ：parts スキル名                                                                     |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function Visible(parts) {
    document.getElementById(parts).style.backgroundColor = '#3f6fbf';
    document.getElementById(parts).style.color = '#8fffff';
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| ポイントに表示されるLv,スキルポイントの量                                                    |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function showMsg() {
    // 引退ボーナス値取得
    RETR_P = eval(document.Msg.Retire.options[document.Msg.Retire.selectedIndex].value);

    // スキルポイント合計が引退ボーナス込み＋３以下の場合
    if(SKLL_P <= 3 + RETR_P){
        document.getElementById("expMsgID").style.backgroundColor = "#ffffff";
        document.Msg.expMsg.value = " Lv: 1"
                                  + "　use: " + SKLL_P
                                  + "　rest: " + eval(72-SKLL_P + RETR_P);
    }
    // スキルポイント合計が引退ボーナス込み＋３より多く引退ボーナス込み＋７２以下の場合
    if(SKLL_P > 3 + RETR_P && SKLL_P <= 72 + RETR_P){
        document.getElementById("expMsgID").style.backgroundColor = "#ffffff";
        document.Msg.expMsg.value = " Lv: " + eval(SKLL_P-2 - RETR_P)
                                  + "　use: " + SKLL_P
                                  + "　rest: " + eval(72-SKLL_P + RETR_P);
    }
    // スキルポイント合計が引退ボーナス込み＋７２より多い場合
    if(SKLL_P > 72 + RETR_P){
        document.getElementById("expMsgID").style.backgroundColor = "#ffdddd";
        document.Msg.expMsg.value = " Lv: 70"
                                  + "　use: " + SKLL_P
                                  + "　over: " + eval(SKLL_P-72 - RETR_P);
    }
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| エンコード                                                                                   |*/
/*|                                                                                              |*/
/*|   引数  ：tdata 保持内容                                                                     |*/
/*|           ver   "20"固定                                                                     |*/
/*|   戻り値：エンコード結果                                                                     |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function encode(tdata, ver) {
    var code = "";
    for( idx = 0; idx < tdata.length/3; idx++ ) {
        tmp = 13 * 13 * tdata[3 * idx] + 13 * tdata[3 * idx + 1] + tdata[3 * idx + 2];
        var tmp2 = "";
        tmp2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(tmp/52))
             + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(tmp%52);
        code = code + tmp2;
    }
    // 置換
    code = code.replace(/aaaaaaaaaa/g,"9");
    code = code.replace(/aaaaaaaaa/g,"8");
    code = code.replace(/aaaaaaaa/g,"7");
    code = code.replace(/aaaaaaa/g,"6");
    code = code.replace(/aaaaaa/g,"5");
    code = code.replace(/aaaaa/g,"4");
    code = code.replace(/aaaa/g,"3");
    code = code.replace(/aaa/g,"2");
    code = code.replace(/aa/g,"1");

    // コードVer付与
    code = ver + code;

    // 隠し属性に設定
    document.Msg.scode.value = code;
    // エンコード結果を返却
    return code;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| デコード                                                                                     |*/
/*|                                                                                              |*/
/*|   引数  ：code 復元内容                                                                      |*/
/*|           ver  "20"固定                                                                      |*/
/*|   戻り値：デコード結果                                                                       |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function decode(code, ver) {
    var tdata = new Array();
    // コードVerチェック
    if( code.substring(0,2) != ver ){
        setAlertLayer("不正なコード、あるいは異なるバージョンのコードです。<br>最新バージョンのコードを使用してください。<br>（スキル構成の変更等の理由によりバージョンが変わります。）");
        for( idx = 0; idx < 50; idx++ ) tdata[idx] = 0;
        return tdata;
    }
    // 復元
    code = code.substring(code.indexOf("0")+1);
    code = code.replace(/9/g,"aaaaaaaaaa");
    code = code.replace(/8/g,"aaaaaaaaa");
    code = code.replace(/7/g,"aaaaaaaa");
    code = code.replace(/6/g,"aaaaaaa");
    code = code.replace(/5/g,"aaaaaa");
    code = code.replace(/4/g,"aaaaa");
    code = code.replace(/3/g,"aaaa");
    code = code.replace(/2/g,"aaa");
    code = code.replace(/1/g,"aa");

    tmp = code;
    jdx = 0;
    for( idx = 0; idx < tmp.length/2; idx++ ) {
        var x = y = 0;
        x = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(tmp.charAt(2 * idx));
        y = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(tmp.charAt(2 * idx + 1));
        tmp2 = 52 * x + y;
        tdata[jdx]     = Math.floor(tmp2 / 169);
        tdata[jdx + 1] = Math.floor((tmp2 % 169) / 13);
        tdata[jdx + 2] = (tmp2 % 169) % 13;
        jdx = jdx + 3;
    }
    // デコード結果を返却
    return tdata;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| ヘルプ表示                                                                                   |*/
/*|                                                                                              |*/
/*|   引数  ：posX     マウスイベントで取得されるカーソル水平座標                                |*/
/*|           posY     マウスイベントで取得されるカーソル垂直座標                                |*/
/*|           Width    ヘルプ表示幅                                                              |*/
/*|           Height   ヘルプ表示高                                                              |*/
/*|           SkillTxt ヘルプ表示文言                                                            |*/
/*|           SkillP   スキルポイント                                                            |*/
/*|   戻り値：デコード結果                                                                       |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function setLayer(posX, posY, Width, Height, SkillTxt, SkillP) {

    // 位置計算
    var X = posX + document.body.scrollLeft + 20;
    var Y = posY + document.body.scrollTop + 20;

    // 水平方向のクライアント領域を超えた分の調整
    if( eval(posX + Width + 50) > document.body.clientWidth ) {
        X = eval(posX - Width + document.body.scrollLeft - 40);
    }
    // 垂直方向のクライアント領域を超えた分の調整
    if( eval(posY + Height + 50) > document.body.clientHeight) {
        Y = eval(posY - Height + document.body.scrollTop - 40);
    }
    // マイナス値は0にする
    if( X < 0 ) {
        X = 0;
    }
    // マイナス値は0にする
    if( Y < 0 ) {
        Y = 0;
    }

    // skilllist.jsの内容を取得
    tmpTxt = eval(SkillTxt);

    // スキルポイントに合わせて消費TP部分を赤文字にする
    if( SkillP > 0 ) {
        tmpTxt = tmpTxt.substring(0, tmpTxt.lastIndexOf("<hr size=0>") + SkillP * 3 + 14)
               + "<span style='color:#ff0066;'>"
               + tmpTxt.substring(tmpTxt.lastIndexOf("<hr size=0>") + SkillP * 3 + 14, tmpTxt.lastIndexOf("<hr size=0>") + SkillP * 3 + 17)
               + "</span>"
               + tmpTxt.substring(tmpTxt.lastIndexOf("<hr size=0>") + SkillP * 3 + 17);
    }

    document.getElementById("skill").style.width           = Width;
    document.getElementById("skill").style.height          = Height;
    document.getElementById("skill").style.backgroundColor = "ffffdd";
    document.getElementById("skill").style.color           = "000033";
    document.getElementById("skill").style.padding         = 10;
    document.getElementById("skill").innerHTML             = tmpTxt;
    document.getElementById("skill").style.border          = "solid 1px #000000";
    document.getElementById("skill").style.left            = X;
    document.getElementById("skill").style.top             = Y;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| ヘルプ非表示                                                                                 |*/
/*|                                                                                              |*/
/*|   引数  ：なし                                                                               |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function offLayer() {
    document.getElementById("skill").style.width           = 0;
    document.getElementById("skill").style.height          = 0;
    document.getElementById("skill").innerHTML             = "";
    document.getElementById("skill").style.backgroundColor = "transparent";
    document.getElementById("skill").style.border          = 0;
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキルポイント表示(クリック対応)                                                             |*/
/*|                                                                                              |*/
/*|   引数  ：x     this.id                                                                      |*/
/*|           y     水平座標                                                                     |*/
/*|           z    0 or 1                                                                        |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function prp(x, y, z) {
    tmp = document.getElementById(x).src;
    mlv = eval(tmp.substring(tmp.lastIndexOf("/") + 1, tmp.lastIndexOf("-")));
    // スキル名
    snm = x.substring(0,4);
    tmp = document.getElementById(snm).style.left;
    p = tmp.substring(0,tmp.length-2);
    // スキルポイント
    slv = Math.floor((y - p - 16 + document.body.scrollLeft) / 8 + z);
    if(slv <= 0) slv = 0;
    if(slv >= mlv) slv = mlv;
    if(0 <= slv) setPoint(snm,slv);
}

/*[]--------------------------------------------------------------------------------------------[]*/
/*| スキルポイント表示(MouseWheel対応)                                                           |*/
/*|                                                                                              |*/
/*|   引数  ：x     this.id                                                                      |*/
/*|           y     2                                                                            |*/
/*|   戻り値：なし                                                                               |*/
/*[]--------------------------------------------------------------------------------------------[]*/
function und(x, y) {

    if( y == 2 ) {
        // 移動量を＋方向に１する
        if( event.wheelDelta <= -120 ) {
            y = 1;
        }
        // 移動量を－方向に１する
        else {
            y = -1;
        }
    }

    // ポイント表示
    tmp = x.substring(0,4);
    setPoint(tmp,eval(tmp + "_P") + y);
}

