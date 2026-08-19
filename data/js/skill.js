/*[]-- ファイル名取得 ----------------------------[]*/
const filename = location.pathname.split('/').pop();
const f_index = filename.lastIndexOf('.');
const nameWithoutExt = f_index !== -1 ? filename.slice(0, f_index) : filename;
console.log("FileName=[" + nameWithoutExt + "]");

/*[]-- 各スキルの値保存領域 ----------------------[]*/
const statusValues = new WeakMap();
const skillValuess = new Map();

/*[]----------------------------------------------[]*/
/*| マウスクリック時処理                           |*/
/*|   引数                                         |*/
/*|     box   : thisオブジェクト                   |*/
/*|     index : スキル値                           |*/
/*[]----------------------------------------------[]*/
function handleClick(box, index) {
    const bar = box.closest(".status-bar");
    id = box.id.substring(0,5);
console.log("handleClick() id=[" + id + "]");
console.log("handleClick() index=[" + index + "]");

    if(0<=index + 1) setPoint(id, index, box);

    // スキル値保存
    statusValues.set(bar, index);
    skillValuess.set(id, bar);
    // 再表示
    updateBar(bar);
}
let wheelLock = false;
/*[]----------------------------------------------[]*/
/*| マウスホイール時処理                           |*/
/*|   引数                                         |*/
/*|     event : eventオブジェクト                  |*/
/*|     bar   : thisオブジェクト                   |*/
/*|     parts : this.idの値                        |*/
/*[]----------------------------------------------[]*/
function handleWheel(event, bar, parts) {
    event.preventDefault();
    id = bar.id.substring(0,5); 

    // 連続イベントを1回にまとめる
    if (wheelLock) return;
    wheelLock = true;
    setTimeout(() => wheelLock = false, 50); // 50msで解除

    // 保存値から取得
    let level = statusValues.get(bar);

    const delta = event.wheelDelta || -event.deltaY;

    // ★ 1ステップに正規化
    const step = delta > 0 ? 1 : -1;

    level += step;

    level = Math.max(0, Math.min(10, level));

console.log("handleWheel() id=[" + id + "] level=[" + level + "] bar=[" + bar + "]");
    if(0<=level) setPoint(id, level, bar);

    // スキル値保存
    statusValues.set(bar, level);
    skillValuess.set(id, bar);
    // 再表示
    updateBar(bar);
}

/*[]----------------------------------------------[]*/
/*| 再表示処理                                     |*/
/*|   引数                                         |*/
/*|     bar   : thisオブジェクト                   |*/
/*[]----------------------------------------------[]*/
function updateBar(bar) {
console.log("updateBar() bar=[" + bar + "]");
    const level = statusValues.get(bar);
    const boxes = bar.querySelectorAll(".box");
    const display = bar.querySelector(".level-display");

    boxes.forEach((box, i) => {
      if (i == 0) box.classList.add("zero");
      else if (i - 1 < level) box.classList.add("active");
      else box.classList.remove("active");
    });

    // スキルレベル値を更新
    if( level < 10 ) {
        display.textContent = level + "/10";
    } else {
        display.textContent = "★/10";
    }
}

/*[]----------------------------------------------[]*/
/*| 初期化処理                                     |*/
/*[]----------------------------------------------[]*/
document.addEventListener("DOMContentLoaded", () => {

    // 初期化（ここが最重要）
    document.querySelectorAll(".status-bar").forEach(bar => {
        id = bar.id;
        skillValuess.set(id, bar);
        updateBar(bar);             // DOM を 0 の状態に同期（必須）
        // onmousewheel が初期状態で発火しないブラウザ対策
        bar.addEventListener("wheel", (e) => handleWheel(e, bar));
    });

    document.querySelectorAll(".status-bar").forEach(bar => {
        statusValues.set(bar, 0);   // 内部値を 0 にセット
        updateBar(bar);             // DOM を 0 の状態に同期（必須）

        // onmousewheel が初期状態で発火しないブラウザ対策
        bar.addEventListener("wheel", (e) => handleWheel(e, bar));

        setPointInit(bar);
    });
});

/*[]----------------------------------------------[]*/
/*| スキル値設定処理                               |*/
/*|   引数                                         |*/
/*|     id    : スキル名                           |*/
/*|     point : スキル値                           |*/
/*[]----------------------------------------------[]*/
function DispPoint(id, point) {
console.log("DispPoint() id=["+ id + "] point=[" + point + "]");
    const bar_id = skillValuess.get(id);
    
    statusValues.set(bar_id, point);
    
console.log("DispPoint() level=[" + statusValues.get(bar_id) + "]");
    // 再表示
    updateBar(bar_id);
}

/*[]----------------------------------------------[]*/
/*| スキル活性化                                   |*/
/*[]----------------------------------------------[]*/
function Visible(parts) {
    skill_box = parts + "_SKILL";
console.log("Visible() skikk_box=[" + skill_box + "]");
    document.getElementById(skill_box).style.backgroundColor = '#3f6fbf';
    document.getElementById(skill_box).style.color           = '#8fffff';
}

/*[]----------------------------------------------[]*/
/*| スキル非活性化                                 |*/
/*[]----------------------------------------------[]*/
function Disable(parts){
    skill_box = parts + "_SKILL";
console.log("Disable() skikk_box=[" + skill_box + "]");
    document.getElementById(skill_box).style.backgroundColor = '#999999';
    document.getElementById(skill_box).style.color           = '#333333';
}

/*[]----------------------------------------------[]*/
/*| Lv、使用、残表示                               |*/
/*[]----------------------------------------------[]*/
function showMsg() {
    // 引退ボーナス値取得
    RTIRE_P = eval(document.Msg.Retire.options[document.Msg.Retire.selectedIndex].value);

    if( SKILL_P <= 3 + RTIRE_P ) {
        document.getElementById("LV").textContent  = 1;
        document.getElementById("USE").textContent = SKILL_P;
        document.getElementById("RES").textContent = eval(72 - SKILL_P + RTIRE_P);

        const el = document.getElementById("RES");
        el.style.background = 'rgba(0, 0, 0, 0.45)';
        el.style.border     = '1px solid rgba(255,255,255,0.25)';
        el.style.padding    = '2px 3px';
        el.style.color      = '#fff';
        el.style.width      = '20px';
    }

    if( SKILL_P > 3 + RTIRE_P && SKILL_P <= 72 + RTIRE_P ) {
        document.getElementById("LV").textContent  = eval(SKILL_P - 2 - RTIRE_P);
        document.getElementById("USE").textContent = SKILL_P;
        document.getElementById("RES").textContent = eval(72 - SKILL_P + RTIRE_P);

        const el = document.getElementById("RES");
        el.style.background = 'rgba(0, 0, 0, 0.45)';
        el.style.border     = '1px solid rgba(255,255,255,0.25)';
        el.style.padding    = '2px 3px';
        el.style.color      = '#fff';
        el.style.width      = '20px';
    }

    if( SKILL_P > 72 + RTIRE_P ) {
        document.getElementById("LV").textContent  = 70;
        document.getElementById("USE").textContent = SKILL_P;
        document.getElementById("RES").textContent = eval(72 - SKILL_P - RTIRE_P);

        const el = document.getElementById("RES");
        el.style.background = 'rgba(255, 0, 80, 0.35)';   // 赤ガラス
        el.style.border     = '1px solid rgba(255, 80, 120, 0.7)';
        el.style.boxShadow  = '0 0 8px rgba(255, 0, 80, 0.6)';
        el.style.padding    = '2px 3px';
        el.style.color      = '#fff';
        el.style.width      = '20px';
    }
}

/*[]----------------------------------------------[]*/
/*| cookieからロード                               |*/
/*[]----------------------------------------------[]*/
function LoadCookie() {

    // 選択されたスロット番号
    slotNum = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
    // キー値
    saveKey = "sq1_" + nameWithoutExt + "_" + slotNum;


    const cookies = document.cookie.split("; ");
    for (const c of cookies) {
        const [key, val] = c.split("=");
        if (key === saveKey) {
            const decoded = decodeURIComponent(val);
            return JSON.parse(decoded);
        }
    }
    return null;
}

/*[]----------------------------------------------[]*/
/*| cookieに保存                                   |*/
/*|   引数                                         |*/
/*|     saveData : 保持内容配列                    |*/
/*[]----------------------------------------------[]*/
function SaveCookie(saveData, days = 7) {

    // 選択されたスロット番号
    slotNum = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
    // スロット名
    slotName = (document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text).split(" : ")[1];

    if( document.Msg.chrName.value == "" ) {
        // 名前が空の場合
        slotName = "no Name";
    }
    else {
        // 名前が空でない場合、「:」「&」を「：」「＆」に変換
        slotName = (document.Msg.chrName.value).replace(/:/g, "：");
        slotName = (document.Msg.chrName.value).replace(/&/g, "＆");
    }
    // スロット名編集
    document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text = "Slot" + slotNum + " : " + slotName;

    // 配列 → JSON文字列
    const json = JSON.stringify(saveData);
    // エンコード
    const encoded = encodeURIComponent(json);
    // UTC形式の日付取得
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // キーを作成
    const key = "sq1_" + nameWithoutExt + "_" + slotNum;

    // cookieに保存
    document.cookie = `${key}=${encoded}; expires=${expires}; path=/`;
}

/*[]----------------------------------------------[]*/
/*| cookieから削除                                 |*/
/*[]----------------------------------------------[]*/
function Delete() {

    // 選択されたスロット番号
    slotNum = document.Msg.Slot.options[document.Msg.Slot.selectedIndex].value;
    // キーを作成
    const key = "sq1_" + nameWithoutExt + "_" + slotNum;

    // UTC形式の日付取得
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";

    // 有効期限を過去にして削除
    document.cookie = `${key}=; expires=${expires}; path=/`;

    document.Msg.Slot.options[document.Msg.Slot.selectedIndex].text = "Slot" + slotNum + " : no Save Data";

}
