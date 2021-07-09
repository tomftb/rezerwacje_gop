class Response
{
    response = new Array();
    functionToRun;
    constructor() 
    {
        console.log('Response::constructor()');
    }
    setResponse (response)
    {
       console.log('Response::setResponse'); 
       //console.log(response); 
       /*
        * TRY CREATE JSON
        */
        try
        {
            this.response = JSON.parse(response);
            return true;
        }
        catch(e)
        {
            console.log(response);
            console.log(e); // error in the above string (in this case, yes)!
            return false;
        }
        return true;
    }
    runTask(response)
    {
        if(!this.setResponse(response))
        {
            alert('Response::runTask::ERROR OCCURRED!');
            return '';
        }
        try
        {
            runFunction(this.response);
        }
        catch(e)
        {
            console.log(e); // error in the above string (in this case, yes)!
            alert('ERROR OCCURED');
        }
    }
    setFunctionToRun(){
        
    }
}
