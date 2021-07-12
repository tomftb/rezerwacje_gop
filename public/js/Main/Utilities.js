class Utilities
{
    setLoadInfo()
    {
        console.log('---setLoadInfo()---\n'+this.formName);
        switch(this.formName)
        {
            case 'sendEmail':
            case 'addProject':
            case 'updateProject':  
                var infoDiv=document.getElementById('ProjectAdaptedBodyExtra');
                removeNodeChilds(infoDiv);
                var img = document.createElement("img");
                var imgDiv = document.createElement("div");
                imgDiv.classList.add("col-sm-auto");
                imgDiv.classList.add("mr-0");
                var pText= document.createElement("span");
                pText.classList.add("text-secondary");
                pText.classList.add("align-text-bottom");
                pText.innerText='Creating and sendig confirm to recipients...';

                var textDiv = document.createElement("div");
                textDiv.classList.add("col-sm-10");
                textDiv.classList.add("ml-0");
                textDiv.classList.add("pt-3");

                textDiv.classList.add("align-bottom");
                textDiv.appendChild(pText);
                img.src = getUrl()+"img/loading_60_60.gif";
                imgDiv.appendChild(img);
                //var text = document.createTextNode('Creating and sendig confirm to recipients...');

                infoDiv.appendChild(imgDiv); 
                infoDiv.appendChild(textDiv); 
                console.log(infoDiv);
                break;           
            default:        
                break;
        };
    }
}

