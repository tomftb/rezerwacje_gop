/* 
 * STYLE (CSS)
 * Author: Tomasz Borczynski
 */
class Style{
    setTextDecoration(ele,style){
        var textDecoration='';
        if(style.underline==='1'){
            textDecoration+='underline';
        };
        if(style['line-through']==='1'){
            textDecoration+=' line-through';
        };
        ele.style.textDecoration=textDecoration;
    }
}