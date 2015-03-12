var fill = d3.scale.category20();

var w = $('#display-wrapper-tag').width(), 
    h = 564;

var focusedTable,
    areaClassObj,
    tagTables = {},
    fontSize = d3.scale.sqrt().range([5, 90]),
    maxLength = 30;
var layout = d3.layout.cloud()
    .timeInterval(100)
    .rotate(function(){return 0;/* make tags rotation*/})
    .size([w, h])
    .fontSize(function(d) { return fontSize(d.count); })
    .font(function(){
	return "fantasy"
    })
    .text(function(d) {return d.tag; })
    .on("end",  draw);
var margin = {top: 35, right: 8, bottom: 75, left: 90},
    widthh = w * 5 / 12 - margin.left - margin.right,
    heightt = window.innerHeight / 2 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, widthh]);
var y = d3.scale.linear()
    .range([heightt, 0]);
var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);
var background = svg.append("g");
var vis = svg.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
var scale = 1;


var box = [];
function tagplacement(){
    namebox.forEach(function(d){
       	    var doc;
	    if(document.getElementById(d[0][0]) != null){
		doc = document.getElementById(d[0][0]).getBBox();
		
		box[d[0][0]] = {'name': d[0][0], 'w':doc.width, 'h':doc.height, 'r':Math.sqrt(Math.pow(doc.x,2)+Math.pow(doc.y,2)), 'x0':doc.x, 'y0':doc.y, 'x1':doc.x - doc.width/2, 'y1':doc.y - doc.height/2, 'x2':doc.x + doc.width/2, 'y2':doc.y + doc.height/2, 'ns':[], 'rns':[], 'lns':[], 'uns':[], 'dns':[],'tns':[],/* 'rtns':[],*/ 'ltns':[], 'utns':[], 'dtns':[] };
	    }//xが間違ってる
	});
    var rname,
	r = 100000000; //rの最小値を求める

    Object.keys(box).forEach(function(d){//NS配布
            Object.keys(box).forEach(function(dd){
                    if(box[d].name != box[dd].name && Math.abs(box[d].x0 - box[dd].x0) < (box[d].w + box[dd].w)/2 && Math.abs(box[d].y0 - box[dd].x0) < (box[d].h + box[dd].h)/2){
			box[d].ns.push(box[dd].name);
                    }
                });
            if(r > box[d].r){
                r = box[d].r,
                    rname = box[d].name;
            }
        });

    Object.keys(box).forEach(function(dd,i){//各点に対するRNS,LNS,TNS,DNSの定義
	    box[dd].ns.forEach(function(d){
		    if(box[d].x0 > box[dd].x0){
			box[dd].rns.push(d);
		    }else if(box[d].x0 < box[dd].x0){
			box[dd].lns.push(d);
		    }
		    if(box[d].y0 >= box[dd].y0){
			box[dd].dns.push(d);
		    }else{
			box[dd].uns.push(d);
		    }
		});

	});

    //tnsの作成
    console.log(box);
    Object.keys(box).forEach(function(d,i){
	    console.log("hoge");
	    function rtns(i) {
		var da = box[i];
		console.log(i);
		if (da.rtns !== undefined) {
		    return da.rtns;
		}
		return da.rtns = Array.prototype.concat.apply(da.rns, da.rns.map(function(j) {
			    return rtns(j);
			}));
	    }
	    rtns(d);
	    d3.set(box[d].rtns).values();
	});
    console.log(box);

    /*
    tnsbox = [];
    while(box[rname][ltns] != tnsbox){
	box[rname][ltns].forEach(function(d){
		tnsbox = box[rname][ltns];
		box[rname][ltns].push(box[d][ns]);
	    });
    }
    tnsbox = [];
    while(box[rname][utns] != unsbox){
	box[rname][ttns].forEach(function(d){
		tnsbox = box[rname][ttns];
		box[rname][ttns].push(box[d][ns]);
	    });
    }
    tnsbox = [];
    while(box[rname][dtns] != tnsbox){
	box[rname][dtns].forEach(function(d){
		tnsbox = box[rname][dtns];
		box[rname][dtns].push(box[d][ns]);
	    });
    }
    //rtnsのソート
    */



}

function test(){
    console.log("hoge");

}
function draw(data, bounds) {
    //    statusText.style("display", "none");
    scale = bounds ? Math.min(
			      w / Math.abs(bounds[1].x - w / 2),
			      w / Math.abs(bounds[0].x - w / 2),
			      h / Math.abs(bounds[1].y - h / 2),
			      h / Math.abs(bounds[0].y - h / 2)
			      ) / 2 : 1;
    var text = vis.selectAll("text")
	.data(data, function(d) {
		return d.text; 
	    });

    text.enter().append("text")
	.attr("text-anchor", "middle")
	.attr("id", function(d){return d.tag})
	.attr("tag", function(d){
		return d.tag})
       	.attr("transform", function(d) { return "translate(" + [tagbox2[d.tag]["x"], tagbox2[d.tag]["y"]] + ")"; })
	//	.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	.style({"font-size": function(d) { return d.size + "px"; }})
	.style("cursor", "hand")
	.text(function(d) { return d.name; })
	.on("click", highlights)
	.on("mouseover.3", function(d){
		d3.select(this)
		    .style({"font-family": "serif"})
		    }
	    )
	.on("mouseout.3", function(d){
		d3.select(this)
		    .style({ "font-family": "fantsy"})
		    }
	    );
    text.style("fill", function(d) { return fill(d.text.toLowerCase()); })
	.style("font-weight", "bold")
        .style("opacity", 1)
	.text(function(d) { return d.text; });
    text.transition()
        .duration(1000);
    var exitGroup = background.append("g")
	.attr("transform", vis.attr("transform"));
    vis.transition()
	.delay(1000)
	.duration(750)
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
    //    $(multilist());
}
/*
function cloudchange(){
    console.log("test");

    var namebox = [];
    d3.csv('tacs/hoge.csv', function(d) {
	    var count;
	    d.forEach(function(dd) {
		    count = 0;
		    namebox.forEach(function(box){
			    if (dd.name == box[0]) {
				box[1]++;
				count = count+1;
			    }
			})
			if(count == 0){
			    tagTables[dd.name] = [];
			    namebox.push([[dd.name], 1]);
			}
		});
	    var hogee = [];
	    namebox.forEach(function(ddd){
		    hogee.push(ddd[0][0]);
		});
	    var send_data= JSON.stringify(hogee);
	    
	    $.ajax({
		    type: "POST",
			url: "tacs/text_write.php",
			//		contentType: "Content-Type: application/json; charset=UTF-8",
			cache: false,
			data: {item : send_data},
			success: function(html){
		    }
		});
	    
	    //nameboxの文字列で類似度計算
	    //tagTables : 各単語についての情報保管
	    //tagTableに類似度結果をpush
	    
	    namebox.forEach(function(dd) {
		    tagTables[dd[0][0]].push({//品詞、元の文書情報
			    sentence: "後日挿入予定",
				mds: 0,
				correlation: dd[1],
				cor: 0
				//			radio:0
				});
		});
	    
	    for (var tag in tagTables) {
		words.push({
			tag: tag,
			    count: tagTables[tag][0].correlation,
			    tables: tagTables[tag]
			    });
	    }
	    words.sort(function(word1, word2) {
		    return word2.count - word1.count;
		});
	    fontSize.domain(d3.extent(words, function(w) {return w.count;}));//この関数はreturn Math.sqrt(d.value)
	    layout.stop()
		.words(words.slice(0, 250))
		.start();
	    if (!document.createElement) return;
	}
	);
    
}
*/
function highlights(d){
    var i = 1;
    while(i < 32){
	if(tagbox2[d.tag][i] == undefined){
	    break;
	}else{
	    var j = 0;
	    while(j < 352){
		if(tagbox2[d.tag][i] == document.getElementsByClassName("vertices")[0].getElementsByTagName("text")[j].textContent){
		    console.log("hoge");
	        }
		j = j + 1;
	    }
	}
	i = i + 1;
    }
}

var cor_value,
    words = [];

var tagbox;
var tagbox2 = {};
var scale = d3.scale.linear()
    .domain([-0.5, 0.5])
    .range([-$('#vis').width()/2, $('#vis').width()/2]);
var xpmax = 0, xmmax = 0, ypmax = 0, ymmax = 0;

d3.csv('tacs/../mds.csv', function(d) {//data about tags
	tagbox = d;
	d.forEach(function(dd){
		if(dd["prex"] > xpmax){
		    xpmax = dd["prex"];
		}else if(dd["prex"] < xmmax){
		    xmmax = dd["prex"];
		}
                if(dd["prey"] > ypmax){
                    ypmax = dd["prey"];
                }else if(dd["prey"] < ymmax){
                    ymmax = dd["prey"];
                }
	    });

	var xscale = d3.scale.linear()
	    .domain([-0.3, 0.3])
	    .range([-$('#vis').width()/2, $('#vis').width()/2]);
	var yscale = d3.scale.linear()
	    .domain([-0.2, 0.2])
	    .range([-$('#vis').height()/2, $('#vis').height()/2]);
	
	d.forEach(function(dd){
		dd.x = xscale(dd["prex"]);
		dd.y = yscale(dd["prey"]);
		tagbox2[dd["tag"]] = dd;
	});
    }
);

var sentencebox;
d3.csv('tacs/../mor-node_words_weight.csv', function(d) {//data about tags
        sentencebox = d;
    }
);



var namebox = [];
d3.csv('tacs/test_unidic.csv', function(d) {
	var count;
	d.forEach(function(dd) {
                count = 0;
                namebox.forEach(function(box1){
			if (dd.name == box1[0]) {
			    box1[1]++;
			    count = count+1;
			}
		    })
		    if(count == 0){
			tagTables[dd.name] = [];
			namebox.push([[dd.name], 1]);
		    }
	    });
	var hogee = [];
	namebox.forEach(function(ddd){
		hogee.push(ddd[0][0]);
	    });
	var send_data= JSON.stringify(hogee);

	$.ajax({
		type: "POST",
		url: "tacs/text_write.php",
		    //		contentType: "Content-Type: application/json; charset=UTF-8",
		cache: false,
		data: {item : send_data},
		success: function(html){
		}
	    });

	//nameboxの文字列で類似度計算
	//tagTables : 各単語についての情報保管
	//tagTableに類似度結果をpush

	namebox.forEach(function(dd) {
		tagTables[dd[0][0]].push({//品詞、元の文書情報
			sentence: "後日挿入予定",
			mds: 0,
			correlation: dd[1],
			cor: 0
			    //			radio:0
			    });
	    });

	for (var tag in tagTables) {
	    words.push({
		    tag: tag,
		    count: tagTables[tag][0].correlation,
		    tables: tagTables[tag]
			});
	}
	words.sort(function(word1, word2) {
		return word2.count - word1.count;
	    });
	fontSize.domain(d3.extent(words, function(w) {return w.count;}));//この関数はreturn Math.sqrt(d.value)
	layout.stop()
	    .words(words.slice(0, 250))
	    .start();
	if (!document.createElement) return;
    }
);

/*
function multilist() {//add tag to multilist
    if (!document.createElement) return;

    words.forEach(function(words2){
            var opt = document.createElement("option");
            opt.className = "elem-selectable";
	    var str = document.createTextNode(words2.tag);
	    opt.appendChild(str);//add tag's info
	    document.getElementById("multi-select").insertBefore(opt, null);//add tag to list
        });

    $(function(){
	    $('#multi-select').multiSelect({
		    selectableHeader: "<div class='custom-header'>Add tags</div>",
			selectionHeader: "<div class='custom-header'>Remove tags</div>"	
			});
	});
}
*/
d3.select('#recreate-tagcloud')
    .on('submit', function() {
	    console.log("aaaa");
	    //タグのcountを設定する。

    }
	);
