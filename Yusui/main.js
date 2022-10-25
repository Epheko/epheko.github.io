let currentPref = "";
let Result;
let enableReq = true;

$("button").click(() => {
    let pref = $("#pref").val();
    if(pref=="")
    {
        console.debug("都道府県指定忘れ");
        return;
    }
    //もう一回APIを叩く
    if (pref != currentPref) {

        let req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            Result = JSON.parse(req.responseText);
            console.debug("load");
           // $("#copy").html(req.responseText);
           Summon();
        });

        if (enableReq) {
            console.debug("リクエスト");
            req.open("GET", "https://livlog.xyz/webapi/springWater?q=" + pref);
            req.send();
        } else {
            let dummyJson = dummy.replace(/[\u0000-\u0019]+/g, "");
            Result = JSON.parse(dummyJson);
            console.debug("load dummy");
            Summon();
        }
    }else
    {
        Summon();
    }
    currentPref=pref;
})

function Summon()
{
    let yusuiInfo = Result.result[Math.floor(Math.random()*Result.result.length)];

    //情報提示
    function ShowInfo(id,info,nullInfo)
    {
        if(info.length>0)
        {
            $(id).html(info);
        }else
        {
            $(id).html(nullInfo);
        }

    }
    
    ShowInfo("#name",hiraToKana(yusuiInfo.furigana),"無名のユウスイ");
    let dsc = yusuiInfo.overview;
    while(dsc.indexOf("湧水")>-1)
    {
        dsc = dsc.replace("湧水","ユウスイ");
    }
    ShowInfo("#overview",dsc,"詳細不明");

    //龍画像
    let svgPath = "k0221_" + yusuiInfo.id % 6 + ".svg";
    console.debug(svgPath);
    var req = new XMLHttpRequest();
    req.responseType = "text";
    req.open("GET", svgPath, true);
    req.addEventListener("load", function (ev) {
        if ((ev.target.status == 200) && (ev.target.readyState == 4)) {
            console.debug("svg");
            $("#svg").html(ev.target.responseText);
            $("svg").css({"fill":"hsl("+ (yusuiInfo.latitude + yusuiInfo.longitude) +", 35%, 40%)"});
        } else {
            console.log("読み込めませんでした");
        }
    });
    req.send(null);

    $("#tweetButton").html("<a id=\"twitter\" href=\"https://twitter.com/share?ref_src=twsrc%5Etfw\" class=\"twitter-share-button\" data-text=\"" + $("#name").html() + "を召喚しました。\nユウスイ召喚 \"data-show-count=\"false\">Tweet</a><script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>");
}

//https://brainlog.jp/programming/javascript/post-2451/
let dummy = "{\"result\":[{\"access\":\"◎\",\"activity\":\"付近住民等が設置した利用マナー等が書かれた立て看板がある。\nまた，定期的に周辺の清掃等を行っているようである。\",\"address\":\"北海道旭川市東旭川町瑞穂\",\"createCd\":null,\"createDate\":null,\"furigana\":\"かみなんぶすいじんぐうのみず\",\"id\":1,\"latitude\":43.720669,\"link\":null,\"longitude\":142.658768,\"name\":\"上南部水神宮の水\",\"oldAddress\":\"旭川市\n東旭川町瑞穂\",\"overview\":\"郊外の山あいの山腹から湧出している湧水。\n湧出場所への立入可能。\",\"updateCd\":null,\"updateDate\":null},{\"access\":\"◎\",\"activity\":\"湧水を含めた春採湖周辺の自然環境把握\",\"address\":\"北海道釧路市春採\",\"createCd\":null,\"createDate\":null,\"furigana\":\"\",\"id\":2,\"latitude\":42.970158,\"link\":null,\"longitude\":144.400345,\"name\":null,\"oldAddress\":\"釧路市\n春採\",\"overview\":\"春採湖岸周辺の崖面や住宅地の緩やかな斜面から湧き出している。\n湧出口付近には花が咲き、流量も適度にある。\",\"updateCd\":null,\"updateDate\":null}]}"


//https://lab.syncer.jp/Web/JavaScript/Snippet/67/
function hsv2rgb ( hsv ) {
	var h = hsv[0] / 60 ;
	var s = hsv[1] ;
	var v = hsv[2] ;
	if ( s == 0 ) return [ v * 255, v * 255, v * 255 ] ;

	var rgb ;
	var i = parseInt( h ) ;
	var f = h - i ;
	var v1 = v * (1 - s) ;
	var v2 = v * (1 - s * f) ;
	var v3 = v * (1 - s * (1 - f)) ;

	switch( i ) {
		case 0 :
		case 6 :
			rgb = [ v, v3, v1 ] ;
		break ;

		case 1 :
			rgb = [ v2, v, v1 ] ;
		break ;

		case 2 :
			rgb = [ v1, v, v3 ] ;
		break ;

		case 3 :
			rgb = [ v1, v2, v ] ;
		break ;

		case 4 :
			rgb = [ v3, v1, v ] ;
		break ;

		case 5 :
			rgb = [ v, v1, v2 ] ;
		break ;
	}

	return rgb.map( function ( value ) {
		return value * 255 ;
	} ) ;
}

//https://qiita.com/mimoe/items/855c112625d39b066c9a
function hiraToKana(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
}
