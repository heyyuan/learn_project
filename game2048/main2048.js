var board = new Array();
var score = 0;
var hasConflicted = new Array();

$(document).ready(function(){
    newgame();
});

function newgame(){
    //初始化棋盘格
    init();
    //随机生成两数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){
        
        var gridCell = $('#grid-cell-'+i+"-"+j);
        gridCell.css('top',getPosTop( i , j ) );
        gridCell.css('left',getPosLeft( i , j ) );
    }

    for( var i = 0 ; i < 4 ; i ++ ){  /**/ 
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0 ;
            hasConflicted[i][j] = false ;
        }
    } 
    
    updateBoardView();

    score = 0 ;
}

function updateBoardView(){
    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){
        $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"><div>' );
        var theNumberCell = $('#number-cell-'+i+'-'+j);

        if( board[i][j] == 0 ){
            theNumberCell.css('width','0px');
            theNumberCell.css('height','0px');
            theNumberCell.css('top',getPosTop(i,j) + 50 );
            theNumberCell.css('left',getPosLeft(i,j) + 50 );
        }
        else{
            theNumberCell.css('width','100px');
            theNumberCell.css('height','100px');
            theNumberCell.css('top',getPosTop(i,j) );
            theNumberCell.css('left',getPosLeft(i,j) );
            theNumberCell.text( board[i][j] );

            theNumberCell.css('color',getNumberColor( board[i][j] ) );
            theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
        }

        hasConflicted[i][j] = false ;
    }
}

function generateOneNumber(){
    if( nospace( board ) )
    return false;

    //随机位置
    var randx = parseInt( Math.floor( Math.random() * 4) );
    var randy = parseInt( Math.floor( Math.random() * 4) );
    //判断该位置是否能用
    var time = 0 ;
    while( time < 50 ){
    if( board[randx][randy] == 0 )
    break;

    var randx = parseInt( Math.floor( Math.random() * 4) );
    var randy = parseInt( Math.floor( Math.random() * 4) );
    time ++ ;
    }
    if( time == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            if(board[i][j] == 0 )
            randx = i ;
            randy = j ;
        }
    }
    //随机数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //随机数字显示在随机位置上
    board[randx][randy] = randNumber ;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

$(document).keydown( function ( event ){ 
    switch( event.keyCode ){
        case 37 :
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38 :
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39 :
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40 :
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;                
    }
});

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
    gameover();
    }
}

function gameover(){
    alert('(>﹏<) GameOver！'); 
}

function moveLeft(){
    if( !canMoveLeft(board)) 
    return false;

    //对左侧每一个数字进行判断
    for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 1 ; j < 4 ; j ++ ){
        if(board[i][j] != 0 ){

            for(var k = 0 ; k < j ; k ++ ){ //寻找落脚点，落脚点为空或落脚点值相同
                if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board) ){
                    showMoveAnimation( i , j , i , k );
                    board[i][k] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board) && !hasConflicted[i][k] ){
                    showMoveAnimation( i , j , i , k );
                    board[i][k] += board[i][j]; 
                    board[i][j] = 0;

                    score += board[i][k];
                    updateScore( score ); 

                    hasConflicted[i][k] = true ;
                    continue;
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if( !canMoveUp ( board ) ) 
    return false;

    //对下方每一个数字进行判断
    for( var j = 0 ; j < 4 ; j ++ )
    for( var i = 1 ; i < 4 ; i ++ ){
        if(board[i][j] != 0 ){

            for(var k = 0 ; k < i ; k ++ ){ //寻找落脚点，落脚点为空或落脚点值相同
                if( board[k][j] == 0 && noBlockVertical( j , k , i , board) ){
                    showMoveAnimation( i , j , k , j );
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board) && !hasConflicted[k][j] ){
                    showMoveAnimation( i , j , k , j );
                    board[k][j] += board[i][j]; 
                    board[i][j] = 0;

                    score += board[k][j];
                    updateScore( score );

                    hasConflicted[k][j] = true;
                    continue;
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight(board)) 
    return false;

    //对右侧每一个数字进行判断
    for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 2 ; j >= 0 ; j -- ){
        if(board[i][j] != 0 ){

            for(var k = 3 ; k > j ; k -- ){ //寻找在右边的落脚点
                if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board) ){
                    showMoveAnimation( i , j , i , k );
                    board[i][k] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board) && !hasConflicted[i][k] ){
                    showMoveAnimation( i , j , i , k );
                    board[i][k] += board[i][j]; 
                    board[i][j] = 0;

                    score += board[i][k];
                    updateScore( score );

                    hasConflicted[i][k] = true ;
                    continue;
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown ( board ) ) 
    return false;

    //对前三行每一个数字进行判断，最底下不用判断
    for( var j = 0 ; j < 4 ; j ++ )
    for( var i = 2 ; i >= 0 ; i -- ){
        if(board[i][j] != 0 ){

            for(var k = 3 ; k > i ; k -- ){ //寻找落脚点，落脚点为空或落脚点值相同
                if( board[k][j] == 0 && noBlockVertical( j , i , k , board) ){
                    showMoveAnimation( i , j , k , j );
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board) && !hasConflicted[k][j] ){
                    showMoveAnimation( i , j , k , j );
                    board[k][j] += board[i][j]; 
                    board[i][j] = 0;

                    score += board[k][j];
                    updateScore( score );

                    hasConflicted[k][j] = true;
                    continue;
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

