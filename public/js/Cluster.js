class Cluster{
    
    static Ajax;
    defaultTask='';
    permissions;
    data;
    static bookClusterNod0={
        i:0,
        n:''
    };
    static bookClusterNod1={
        i:0,
        n:''
    };
    static bookClusterLab={
        i:0,
        n:''
    };
    
    constructor(Ajax) {
        console.log('Cluster::constructor()');
        Cluster.Ajax=Ajax;
        console.log(Cluster.Ajax);
        Cluster.Ajax.setModul(this);
        Cluster.Ajax.setModulTask('runMain');
    }
    setDefaultTask(task){
        this.defaultTask=task;
    }
    display(){
        Cluster.Ajax.setModulTask('runMain');
        Cluster.Ajax.getData(this.defaultTask);
    }
    runMain(response){
        console.log('CLUSTER::runMain');
        //console.log(response);
        try{
            this.setResponseData(response);
            this.checkResponseErr();
            this.setFirstBookClusterId();
            this.bookCluster();
            this.allocationTable();
            this.setErr('');
        }
        catch(e){
            this.setErr(e);
        }
       
    }
    allocationTable(){
        console.log('CLUSTER::allocationTable');
        
        var all=this.data['data']['value']['all'];
            console.log(all);
        var tBody=document.getElementById('clusterTableBody');
            this.clear(tBody);
        var tr=document.createElement('tr');
        var td1=document.createElement('td');
        var td2=document.createElement('td');
        //console.log(table);
        for (const property in all)
        {        
            //console.log(property);
            //console.log(d['data']['value'][property]);
            var td1=document.createElement('td');
                td1.setAttribute('class','td_main');
                td1.appendChild(document.createTextNode(all[property]['n']));
            var td2=document.createElement('td');
                td2.setAttribute('class','td_main');
                td2.appendChild(document.createTextNode(all[property]['c']));
            var tr=document.createElement('tr');
                tr.appendChild(td1);
                tr.appendChild(td2);
                tBody.appendChild(tr);
        }
    }
    updateAllocationTable(response){
        try{
            this.setResponseData(response);
            this.checkResponseErr();
            this.allocationTable();
            this.setErr('');
        }
        catch(e){
            this.setErr(e);
        }
        /*
         * CLEAR DATA
         */
    }
    clear(ele){
        while (ele.firstChild)
        {
            ele.firstChild.remove(); 
        };
    }
    bookCluster(){
        console.log('CLUSTER::bookCluster');
        var mainDiv=document.getElementById('bookCluster');
        this.createList('Aktualnie wskazana:','Dostępne :',document.getElementById('bookClusterLab'),this.data['data']['value']['labs'],[Cluster.bookClusterLab]);
        this.createList('Aktualnie wskazany:','Dostępne :',document.getElementById('bookClusterNod0'),this.data['data']['value']['clusters'],[Cluster.bookClusterNod0]);
        this.createList('Aktualnie wskazany:','Dostępne :',document.getElementById('bookClusterNod1'),this.data['data']['value']['clusters'],[Cluster.bookClusterNod1]);
        this.update(document.getElementById('bookClusterBtn'));
        console.log(mainDiv);
    }
    setFirstBookClusterId(){
        Cluster.bookClusterNod0.i=this.data['data']['value']['clusters'][0]['i'];
        Cluster.bookClusterNod0.n=this.data['data']['value']['clusters'][0]['n'];
        Cluster.bookClusterNod1.i=this.data['data']['value']['clusters'][0]['i'];
        Cluster.bookClusterNod1.n=this.data['data']['value']['clusters'][0]['n'];
        Cluster.bookClusterLab.i=this.data['data']['value']['labs'][0]['i'];
        Cluster.bookClusterLab.n=this.data['data']['value']['labs'][0]['n'];
    }
    createNodeListGroup(label,data){
        var opt=document.createElement('optgroup');
            opt.setAttribute('label',label);
            opt.setAttribute('class','OPTGROUP');
            this.createNodeListOption(opt,data);
        return opt;
    }
    createNodeListOption(ele,data){
        console.log(data);
        for (const prop in data)
        {
            var option=document.createElement('option');
            
                option.setAttribute('value',data[prop]['i']);
                option.appendChild(document.createTextNode(data[prop]['n']));
                ele.appendChild(option);
                //option.setAttribute('value');
            //console.log(data[prop]['i']);
            //console.log(data[prop]['n']);
        }
    }
    createList(label1,label2,ele,data,first){
        var optGroupAct=this.createNodeListGroup(label1,first);
        var optGroupAva=this.createNodeListGroup(label2,data);
            ele.appendChild(optGroupAct);
            ele.appendChild(optGroupAva);
            this.setOnChange(ele);
    }
    setOnChange(ele){
        ele.onchange = function(){
            console.log('onChange');
            Cluster.updateList(this);
            
            
        };
    }
    static updateList(ele){
        console.log(ele.id);
        console.log(ele.value);
        /* GET FROM ARRAY */
        Cluster[ele.id]['i']=ele.value;
        
    }
    setResponseData(response){
        //console.log(response);
        this.data=JSON.parse(response);
    }
    update(btn){
        console.log('CLUSTER::update');
        btn.onclick = function (){
            console.log('CLUSTER::update:click');
            Cluster.Ajax.setModulTask('updateAllocationTable');
            Cluster.Ajax.getData('updateClustr&n0='+Cluster.bookClusterNod0.i+'&n1='+Cluster.bookClusterNod1.i+'&p='+Cluster.bookClusterLab.i);
        };
    }
    setPermissions(perm){
        this.permissions=perm;
        //console.log(this.permissions);
    }
    setErr(info){
        console.log('CLUSTER::setErr');
        //console.log(info);
        var errDiv=document.getElementById('bookClusterDivErr');
            errDiv.innerHTML=info;
        if(info!==''){
                errDiv.classList.remove("d-none");
        }
        else{
            errDiv.classList.add("d-none");
        }
        //console.log(errDiv);
    }
    checkResponseErr(){
        if(this.data['status']===1){
            throw this.data['info'];
        }
    }
}

var Cl = new Cluster(new Ajax);
    Cl.setDefaultTask('getActClustrsUsage');
    Cl.setPermissions(loggedUserPerm);
    Cl.display();