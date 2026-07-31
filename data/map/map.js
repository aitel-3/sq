/*[]-- ＭＡＰメモ表示用----------------------------------------------[]*/
/*|  動的ＭＡＰメモ表示用共通スクリプト                               |*/
/*[]-----------------------------------------------------------------[]*/

/*[]-- ブラウザのバージョンチェック ---------------------------------[]*/
var dom = document.getElementById;                                      /* W3C DOM をサポートする場合 */
var opera = navigator.userAgent.indexOf("Opera")>-1;                    /* Opera                      */
var ie4 = document.all && !dom && !opera;                               /* Internet Explorer 4.x      */
var ie5 = document.all && dom && !opera;                                /* Internet Explorer 5.x 以上 */
var ie = ie4 || ie5;                                                    /* Internet Explorer 4.x 以上 */
var netscape = navigator.appName.indexOf("Netscape",0)>-1;              /* Netscape                   */
var nn4 = document.layers && netscape;                                  /* Netscape 4.x               */
var nn6 = dom && netscape;                                              /* Netscape 6.x 以上          */

var Nbef = 0;

/*[]-- 初期化 -------------------------------------------------------[]*/
/*|  n:初期回する回数                                                 |*/
/*[]-----------------------------------------------------------------[]*/
function Init(){
  for(i = 0; i <= maxMemo; i++){
    if(ie4) {
      lay = document.all["iL"+i];
      lay.style.visibility = "hidden";
    }
    else if(nn4) {
      lay = document.layers["iL"+i];
      lay.visibility = "hide";
    }
    else {
      lay = document.getElementById("iL"+i);
      lay.style.visibility = "hidden";
    }
  }
  Mover(0);
}

/*[]-- サブ画面表示 -------------------------------------------------[]*/
/*|  n:表示する内容（０は初期表示用、普通指定は1からの連番            |*/
/*[]-----------------------------------------------------------------[]*/
function Mover(n){
  if(n == Nbef && Nbef != 0)return;
  Mout(Nbef);
  Nbef = n;
  Com = "<div class=MemoStyle>" + MemoSubSet(n) + "<\/div>";
  if(ie4) {
    lay = document.all["iL"+n];
    lay.innerHTML = Com;
    lay.style.visibility = "visible";
  }
  else if(nn4) {
    lay = document.layers["iL"+n];
    lay.document.open();
    lay.document.write(Com);
    lay.document.close();
    lay.visibility = "show";
  }
  else {
    lay = document.getElementById("iL"+n);
    lay.innerHTML = Com;
    lay.style.visibility = "visible";
  }
}
/*[]-- サブ画面制御 -------------------------------------------------[]*/
/*|  n:表示する内容（０は初期表示用、普通指定は1からの連番            |*/
/*[]-----------------------------------------------------------------[]*/
function Mout(n){
  if(ie4) {
    lay = document.all["iL"+n];
    lay.style.visibility = "hidden";
  }
  else if(nn4) {
    lay = document.layers["iL"+n];
    lay.visibility = "hide";
  }
  else {
    lay = document.getElementById("iL"+n);
    lay.style.visibility = "hidden";
  }
}
/*[]-- サブ画面に表示する内容 ---------------------------------------[]*/
/*|  n:表示する内容（０は初期表示用、普通指定は1からの連番            |*/
/*[]-----------------------------------------------------------------[]*/
function MemoSubSet(n){
  var MemoSub = new Array();

  MemoSub[n] = '<table cellspacing=0 cellpadding=1 border=1>';
  MemoSub[n]+= '<tr><td align=center valign=top><table cellspacing=0 cellpadding=0 border=0>';
  MemoSub[n]+= '<tr><td><table cellspacing=1 cellpadding=2 border=0>';
  MemoSub[n]+= '<tr><td width=36 align=center class=t>メモ<\/td><td class=n width=609>';
  MemoSub[n]+= memomemo[n];
  MemoSub[n]+= '<\/td><\/tr><\/table><\/td><\/tr><\/table><\/td><\/tr><\/table>';

  return MemoSub[n];
}
/*[]-- MAPエリア範囲 ------------------------------------------------[]*/
/*|  p:エリア区分（A～F）                                             |*/
/*|  q:エリア区分（0はクリア、普通指定は1～7）                        |*/
/*|  m:縦方向（1～5）                                                 |*/
/*|  n:横方向（1～5）                                                 |*/
/*| ┏━┳━━━━━━━━━━━━━━┓ex) A-1(2,2)                  |*/
/*| ┃  ┃             １             ┃     p:A                      |*/
/*| ┣━╋━━┯━━┯━━┯━━┯━━┫     q:1                      |*/
/*| ┃  ┃1,1 │1,2 │1,3 │1,4 │1,5 ┃     m:2                      |*/
/*| ┃  ┠──┼──┼──┼──┼──┨     n:2                      |*/
/*| ┃  ┃2,1 │2,2 │2,3 │2,4 │2,5 ┃ 戻り値："32,33,47,48"        |*/
/*| ┃  ┠──┼──┼──┼──┼──┨                              |*/
/*| ┃Ａ┃3,1 │3,2 │3,3 │3,4 │3,5 ┃ex) F-7(5,5)                  |*/
/*| ┃  ┠──┼──┼──┼──┼──┨     p:F                      |*/
/*| ┃  ┃4,1 │4,2 │4,3 │4,4 │4,5 ┃     q:7                      |*/
/*| ┃  ┠──┼──┼──┼──┼──┨     m:5                      |*/
/*| ┃  ┃5,1 │5,2 │5,3 │5,4 │5,5 ┃     n:5                      |*/
/*| ┗━┻━━┷━━┷━━┷━━┷━━┛ 戻り値："626,537,641,552"    |*/
/*|                                                                   |*/
/*| 各エリアの基本座標                                                |*/
/*| A-1( 14, 15) A-2(104, 15) A-3(194, 15) A-4(284, 15) A-5(374, 15)  |*/
/*| A-6(464, 15) A-7(554, 15)                                         |*/
/*| B-1( 14,105) B-2(104,105) B-3(194,105) B-4(284,105) B-5(374,105)  |*/
/*| B-6(464,105) B-7(554,105)                                         |*/
/*| C-1( 14,195) C-2(104,195) C-3(194,195) C-4(284,195) C-5(374,195)  |*/
/*| C-6(464,195) C-7(554,195)                                         |*/
/*| D-1( 14,285) D-2(104,285) D-3(194,285) D-4(284,285) D-5(374,285)  |*/
/*| D-6(464,285) D-7(554,285)                                         |*/
/*| E-1( 14,375) E-2(104,375) E-3(194,375) E-4(284,375) E-5(374,375)  |*/
/*| E-6(464,375) E-7(554,375)                                         |*/
/*| F-1( 14,465) F-2(104,465) F-3(194,465) F-4(284,465) F-5(374,465)  |*/
/*| F-6(464,465) F-7(554,465)                                         |*/
/*|                                                                   |*/
/*| 1マス:16x16 増分:+15,+15                                          |*/
/*|                                                                   |*/
/*| マス間増分:+18,+18                                                |*/
/*[]-----------------------------------------------------------------[]*/
function MapArea(p,q,m,n){

  var pos = p + '_' + q;

  var b = {};
  if(p == 'A'){
    if(q == 0){      b[pos] = [  1,  1]; }
    else if(q == 1){ b[pos] = [ 14, 15]; }
    else if(q == 2){ b[pos] = [104, 15]; }
    else if(q == 3){ b[pos] = [194, 15]; }
    else if(q == 4){ b[pos] = [284, 15]; }
    else if(q == 5){ b[pos] = [374, 15]; }
    else if(q == 6){ b[pos] = [464, 15]; }
    else if(q == 7){ b[pos] = [554, 15]; }
    else           { b[pos] = [  1,  1]; }
  }
  if(p == 'B'){
    if(q == 1){      b[pos] = [ 14,105]; }
    else if(q == 2){ b[pos] = [104,105]; }
    else if(q == 3){ b[pos] = [194,105]; }
    else if(q == 4){ b[pos] = [284,105]; }
    else if(q == 5){ b[pos] = [374,105]; }
    else if(q == 6){ b[pos] = [464,105]; }
    else if(q == 7){ b[pos] = [554,105]; }
    else           { b[pos] = [  1,  1]; }
  }
  if(p == 'C'){
    if(q == 1){      b[pos] = [ 14,195]; }
    else if(q == 2){ b[pos] = [104,195]; }
    else if(q == 3){ b[pos] = [194,195]; }
    else if(q == 4){ b[pos] = [284,195]; }
    else if(q == 5){ b[pos] = [374,195]; }
    else if(q == 6){ b[pos] = [464,195]; }
    else if(q == 7){ b[pos] = [554,195]; }
    else           { b[pos] = [  1,  1]; }
  }
  if(p == 'D'){
    if(q == 1){      b[pos] = [ 14,285]; }
    else if(q == 2){ b[pos] = [104,285]; }
    else if(q == 3){ b[pos] = [194,285]; }
    else if(q == 4){ b[pos] = [284,285]; }
    else if(q == 5){ b[pos] = [374,285]; }
    else if(q == 6){ b[pos] = [464,285]; }
    else if(q == 7){ b[pos] = [554,285]; }
    else           { b[pos] = [  1,  1]; }
  }
  if(p == 'E'){
    if(q == 1){      b[pos] = [ 14,375]; }
    else if(q == 2){ b[pos] = [104,375]; }
    else if(q == 3){ b[pos] = [194,375]; }
    else if(q == 4){ b[pos] = [284,375]; }
    else if(q == 5){ b[pos] = [374,375]; }
    else if(q == 6){ b[pos] = [464,375]; }
    else if(q == 7){ b[pos] = [554,375]; }
    else           { b[pos] = [  1,  1]; }
  }
  if(p == 'F'){
    if(q == 1){      b[pos] = [ 14,465]; }
    else if(q == 2){ b[pos] = [104,465]; }
    else if(q == 3){ b[pos] = [194,465]; }
    else if(q == 4){ b[pos] = [284,465]; }
    else if(q == 5){ b[pos] = [374,465]; }
    else if(q == 6){ b[pos] = [464,465]; }
    else if(q == 7){ b[pos] = [554,465]; }
    else           { b[pos] = [  1,  1]; }
  }

  const incTrout = 15;         /* １マス増分 */
  const incLattice = 18;       /* マス間増分 */

  if(p == 'A' && q == 0){
    return b[pos][0] + ',' + b[pos][1] + ',13,14';
  }else{
    return (b[pos][0] + (n-1)*incLattice) + ',' + (b[pos][1] + (m-1)*incLattice) + ',' + ((b[pos][0] + (n-1)*incLattice) + incTrout) + ',' + ((b[pos][1] + (m-1)*incLattice) + incTrout);
  }
}

