bs=new Array();
bs2=new Array();
c=new ball();

function ball(){
	this.x=0;
	this.y=0;
	this.r=0;	//旋转的弧度
	this.sz=30;		//小圆的半径
	this.offset=250;	//伸出的长度
	this.name="";
	this.color="lightgreen";	//小圆的颜色
	this.vx=0,this.vy=0;
};
ball.prototype.draw = function(g) {//画大圆和小圆
	g.save();
	g.translate(this.x,this.y);	//接受mydraw中的bs[i].x,bs[i].y
	g.rotate(this.r)
	g.translate(this.offset,0);
	g.fillStyle=this.color;
	g.beginPath();
	g.arc(0,0,this.sz,0,Math.PI*2,true);
	g.closePath();
	g.fill();
	g.fillStyle="black";			//字体的颜色

	if (this.name.length<2)
	{
		g.font = "50px Courier New";	//字体的大小
		g.fillText(this.name,-15,15);
	}
	else
	{
		//console.log("less",typeof(this.name),this.name.length);
		g.font = "30px Courier New";	//字体的大小
		g.fillText(this.name,-15,10);
	}
	//g.stroke();
	g.restore();
};

function mydraw(g)	//画基础连接线
{
	g.lineWidth=5;	//线宽
	g.strokeStyle="red";	//线的颜色
	for(var i=0;i<bs.length;i++)	//线的根数
	{

		g.save();
		g.beginPath();
		g.translate(c.x,c.y);	//将之前的（0,0）设置在（c.x,x.y）
		g.moveTo(0,0);	//将笔头放在（0,0）||此时的(0,0)就是(c.x,x.y)
		g.rotate(bs[i].r);	//以0，0为中心旋转度数.此时0，0为c.x,c.y
		g.lineTo(bs[i].offset,0);	//250,0
		g.closePath();
		g.stroke();
		g.restore();
		bs[i].x=c.x,bs[i].y=c.y;
		bs[i].draw(g);	//用bs的数据画小圆
	}
	c.draw(g);	//用c的数据画大圆
}

ball.prototype.update = function(g) {
	this.r+=speed;	//角度的改变
	/*this.x+=this.vx;//,this.y+=this.vy;
	if (this.x>600 || this.x <200)
	{
		//this.vx=-this.vx;
	}*/
};

function update()
{
	for(var i=0;i<bs.length;i++)
	{
		bs[i].update();//把数据更新到bs
	}
	c.update();	
}

function end(g)	//遮挡画面的圆
{	
	g.beginPath();
	g.arc(0,0,mp,0,Math.PI*2,true); //圆
	g.fillStyle = "lightgreen";
	g.fill();
	g.closePath();
	mp+=20;  
}

function ak()	//碰撞检测
{
	var a=(Math.atan(3/25)*180/Math.PI)*Math.PI/180;	//弧度
	for(i=0;i<bs.length;i++)
	{
		if(bs[i].r >=Math.PI*2)
		{
			bs[i].r -= Math.PI*2;
		}
		if(i>0)
		{
			if(Math.abs(bs[i].r-Math.PI/2)<=(2*a)&&Math.abs(bs[i].r-Math.PI/2!=0))
			{
				flag = 1;
			}
		}
		else
		{
			if(Math.abs(bs[i].r-Math.PI/2)<=(2*a))
			{
				flag = 1;
			}
		}
		//console.log(Math.abs(bs[i].r-Math.PI/2));
	}
}

function under(g,tp)	//上弹小球
{
	for(var h=0;h<tp;h++)
	{
		g.beginPath();
		g.arc(1000,860+h*60,30,0,Math.PI*2,true); //圆
		g.fillStyle = "lightgreen";
		g.fill();
		g.closePath();
    	g.fillStyle = 'black';  //颜色 
    	var test=parseInt(bs[bs.length-md+1+h].name);
    	test+=md-1;	//根据关卡数
    	if(test<10)
    	{
    		test.toString();
    		g.font = 'bold 40px arial';
    		g.fillText(test, 988,875+h*60);
    	}
    	else
    	{
    		test.toString();
    		g.font = 'bold 30px arial';
    		g.fillText(test, 982,870+h*60);
    	}
	}
	
}

function mouseclick(g)	//鼠标单击事件
{
	canvas.onclick=function()
	{
		b=new ball();
		b.r=Math.PI/2;	//角度
		b.name=(bs.length).toString();	//球内名字（0~9）
		bs.push(b);//把b的内容压入bs
		ak();
		tp--;	
    }
}
function win(g)
{
	g.beginPath();
	g.arc(0,0,2000,0,Math.PI*2,true); //圆
	g.fillStyle = "lightgreen";
	g.fill();
	g.closePath(); 
	g.font = 'bold 300px arial';
    g.fillStyle = 'red';  //颜色 
    g.fillText("你赢啦！", 420, 600);
	context.clearRect(0,0,canvas.width,canvas.height);
}
function closeplay(g)	//游戏结束的画面
{
	if(mp<3000)
			{
				end(g);
				g.font = 'bold 300px arial';
    			g.fillStyle = 'red';  //颜色 
    			g.fillText("你输啦！", 420, 600);
			}
			else
			{
				startplay();
				tp=3;
				flag=0;
				mp=0;
			}
}
function startplay()	//把关卡导入
{
	bs=new Array();
	for(var i=0;i<md;i++)
	{
		b=new ball();
		b.r=i*Math.PI*2/md;	//弧度
		b.name=i.toString();	//球内名字（0~9）//数字变字符
		//console.log(b);
		bs.push(b);//把b的内容压入bs
	}
}
function next() {	//马上调用
	var canvas=document.getElementById('canvas'),
		context=canvas.getContext('2d');
		c.sz=100,c.x=canvas.width/2,c.y=350,c.offset=0,c.color="white",speed=0.004;
		c.vx=1,flag=0,mp=0,tp=3,md=4;	//大球的参数信息
		startplay();
		c.name=md.toString();
	(function drawf(){
		requestAnimationFrame(drawf,canvas);
		context.clearRect(0,0,canvas.width,canvas.height);
		mouseclick(context);
		under(context,tp);
		if(tp<=0)
		{
			win(context);
		}
		mydraw(context);
		if(flag == 0)
		{
			update();
			c.draw(context);
		}
		else
		{
			closeplay(context);
		}
	}());

}