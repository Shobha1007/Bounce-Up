document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const player = document.createElement("div");
    let GameOver = false;
    const gridheight = 650;
    let platCount = 5;
    const platGap = 600 / platCount;
    let platforms = [];
    let playerbottom=150;
    let startpoint =playerbottom;
    let playerleft=50;
    let isJumping=true;
    let upward;
    let downward;
    let isGoingLeft=false;
    let isGoingRight=false;
    let leftTimerId;
    let RightTimeId;
    let score = 0;
    let highScore=localStorage.getItem('hs');
    const loosingSound= new Audio('loosingSound.wav');
    const jumpSound = new Audio('jumpSound.wav');
    
    class Platform {
        constructor(newPlatBottom){
        this.bottom = newPlatBottom;
        this.left = Math.random() * 280;
        let platform = document.createElement("div");
        this.visual=platform;
        }

        draw(){
            
            grid.appendChild(this.visual);
            this.visual.classList.add('platform');
            this.visual.style.left=this.left + 'px';
            this.visual.style.bottom=this.bottom + 'px';
        }
    }
    function createPlatform(){
        for (let i=0;i<platCount ; i++){
            let newPlatBottom = 100 + platGap*i;
            let newPlat=new Platform(newPlatBottom);
            platforms.push(newPlat);
            newPlat.draw();
        }
    }
    function movePlat(){
        if (playerbottom>200){
        platforms.forEach(p =>{
            p.bottom-=4;
            let visual = p.visual;
            visual.style.bottom= p.bottom + 'px';
            if(p.bottom<10){
                let firstplatform=platforms[0].visual;
                firstplatform.classList.remove('platform');
                platforms.shift(); 
                score++;
                let Scoreupdate=document.querySelector('.score');
                Scoreupdate.innerHTML='Your Score : '+score;
                let newPlatform = new Platform(600);
                newPlatform.draw();
                platforms.push(newPlatform);

            }
        })
    }
    }
    function createPlayer() {
        grid.appendChild(player);
        player.classList.add('player');
        playerbottom = platforms[0].bottom + 15;
        playerleft = platforms[0].left;
        player.style.bottom=playerbottom + 'px';
        player.style.left = playerleft + 'px';
    }

    function jump(startpoint){
        clearInterval(downward);
        isJumping=true;
        // jumpSound.pause();
        upward = setInterval(function(){
            playerbottom+=20;
            player.style.bottom=playerbottom + 'px';
            if (playerbottom >= (startpoint +160) || playerbottom>=600){
                fall();
                // isJumping=false;
            }
        },30)
    }
    
    function fall(){
        isJumping=false;
        clearInterval(upward);
        downward = setInterval(function(){
            playerbottom-=5;
            player.style.bottom=playerbottom + 'px';
            if (playerbottom <=0){
                // console.log("gameover");
                gameOver();
                // return;
            }
            platforms.forEach(platform=>{
                if((platform.bottom+15>=playerbottom)&&
                    (playerbottom>=platform.bottom)&&
                    ((playerleft + 80)>=platform.left)&&
                    (playerleft<= (platform.left+100)) &&
                    (!isJumping)
                ){
                    clearInterval(downward);
                    startpoint=playerbottom;
                    jump(startpoint);
                    isJumping=true;
                    jumpSound.play();
                    jumpSound.playbackRate=2;
                    // jumpSound.pause();
                    

                }
                
            })

        },30)
    }
    
    function moveleft(){
        if(isGoingRight){
            clearInterval(RightTimerId);
            isGoingRight=false;
        }
        
        player.style.transform='scale(-1,1)';
        isGoingLeft=true;
        leftTimerId=setInterval(function(){
            if(playerleft>=0){
                playerleft-=4;
                player.style.left = playerleft + 'px';
            }else{
                // clearInterval(leftTimerId);
                // isGoingLeft=false;
                moveright();
            }
            
        },20)}
    function moveright(){
        
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft=false;
            player.style.setProperty('transform','initial')
        }
        
        isGoingRight=true;
        RightTimerId=setInterval(function(){
            if(playerleft<=320){
                playerleft+=4;
                player.style.left = playerleft + 'px';
            }else{
                // clearInterval(RightTimeId);
                // isGoingRight=false;
                moveleft();
            }
            
        },20)}
    function movestraight(){
        isGoingLeft=false;
        isGoingRight=false;
        clearInterval(RightTimeId);
        clearInterval(leftTimerId);
        // jump(startpoint);
    }
    function control(e){
        player.style.bottom = playerbottom + 'px';
        if(e.key==='ArrowLeft'){
            moveleft();
        }
        else if (e.key=='ArrowRight'){
            moveright();
        }
        else if (e.key==='ArrowUp'){
            movestraight();
        }
    }
    function Playagain(){
        window.document.location='./lastpage.html';
    }
    
    function gameOver(){
        GameOver=true;
        loosingSound.play();
        clearInterval(upward);
        clearInterval(downward);
        clearInterval(leftTimerId);
        clearInterval(RightTimeId);
       
        localStorage.setItem('Score',score);
        if(score>highScore){
            highScore=score;
        }
        localStorage.setItem('HighScore',highScore);
        
        let u=setInterval(function(){
            playerbottom+=15;
            player.style.bottom=playerbottom+'px';
            player.style.transform='scale(2,2)';
            if(playerbottom>=300){
                clearInterval(u);
                let d=setInterval(() => {
                    playerbottom-=6;
                    player.style.bottom= playerbottom + 'px';
                    player.style.transform='rotate(90deg)';
                    if(playerbottom<=-10){
                        clearInterval(d);
                    }
                }, 20);
            }
        },20)
        // while(grid.firstChild){
        //     grid.removeChild(grid.firstChild);
        // }
        setTimeout(function(){
            Playagain();
        },1800);
    }
    // if(window.s){
    //     Arrow = document.createElement('button');
    //     rightArrow = document.createElement('img');
    //     rightArrow.src='./Arrow.png';
    //     Arrow.appendChild(rightArrow);
    //     grid.appendChild(Arrow);
    // }
    function start() {
        if (!GameOver) {
            createPlatform();
            createPlayer();
            setInterval(movePlat,30);
            jump(startpoint);
            document.addEventListener('keyup',control);
            
        }
    }
    start();
}) 