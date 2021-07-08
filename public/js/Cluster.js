class Cluster{
    
    static Ajax;
    defaultTask='';
    static permissions;
    static data;
    static bookClusterNod0={
        i:'0',
        i_old:'0',
        n:'',
        n_old:'',
        d:[],
        l:'Aktualnie wskazany:'
    };
    static bookClusterNod1={
        i:'0',
        i_old:'0',
        n:'',
        n_old:'',
        d:[],
        l:'Aktualnie wskazany:'
    };
    static bookClusterLab={
        i:'0',
        i_old:'0',
        n:'',
        n_old:'',
        d:[],
        l:'Aktualnie wskazana:'
    };
    
    constructor(Ajax) {
        console.log('Cluster::constructor()');
        Cluster.Ajax=Ajax;
        console.log(Cluster.Ajax);
        Cluster.Ajax.setModul(this);
        //Cluster.Ajax.setModulTask('runMain');
    }
    setDefaultTask(task){
        this.defaultTask=task;
    }
    loadData(){
        Cluster.Ajax.setModulTask('runMain');
        Cluster.Ajax.getData('getModulClusterDefaultData');
    }

    runMain(response){
        console.log('CLUSTER::runMain');
        try{ 
            Cluster.setUpJsonData(response);
            this.checkResponseErr();
            this.setPermissions();
            this.setClustrData();
            this.setFirstBookClusterId();
            this.bookCluster();
            this.allocationTable();
            this.setErr('');
        }
        catch(e){
            this.setErr(e);
        }
       
    }
    static setUpJsonData(response){    
        console.log(response);
        Cluster.data=JSON.parse(response);
        console.log(Cluster.data);
    }
    allocationTable(){
        console.log('CLUSTER::allocationTable');
        
        var all=Cluster.data['data']['value']['all'];
            //console.log(all);
        var tBody=document.getElementById('clusterTableBody');
            Cluster.clear(tBody);
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
            Cluster.setUpJsonData(response);
            this.checkResponseErr();
            this.setClustrData();
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
    static clear(ele){
        while (ele.firstChild)
        {
            ele.firstChild.remove(); 
        };
    }
    bookCluster(){
        console.log('CLUSTER::bookCluster');
        Cluster.rebuildDataObject(Cluster['bookClusterLab']);
        Cluster.createList('bookClusterLab',Cluster['bookClusterLab'].d);
        Cluster.rebuildDataObject(Cluster['bookClusterNod0']);
        Cluster.createList('bookClusterNod0',Cluster['bookClusterNod0'].d);
        Cluster.rebuildDataObject(Cluster['bookClusterNod1']);
        Cluster.createList('bookClusterNod1',Cluster['bookClusterNod1'].d);
        this.update(document.getElementById('bookClusterBtn'));
    }
    setFirstBookClusterId(){
        Cluster.bookClusterNod0.i=Cluster.data['data']['value']['clusters'][0]['i'];
        Cluster.bookClusterNod0.n=Cluster.data['data']['value']['clusters'][0]['n'];
        Cluster.bookClusterNod1.i=Cluster.data['data']['value']['clusters'][0]['i'];
        Cluster.bookClusterNod1.n=Cluster.data['data']['value']['clusters'][0]['n'];
        Cluster.bookClusterLab.i=Cluster.data['data']['value']['labs'][0]['i'];
        Cluster.bookClusterLab.n=Cluster.data['data']['value']['labs'][0]['n'];
    }
    static createNodeListGroup(label,data){
        var opt=document.createElement('optgroup');
            opt.setAttribute('label',label);
            opt.setAttribute('class','OPTGROUP');
            Cluster.createNodeListOption(opt,data);
        return opt;
    }
    static createNodeListOption(ele,data){
        //console.log(data);
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
    static createList(id,data){
        console.log('CLUSTER::createList');
        var ele=document.getElementById(id);
        var first=Cluster[id];
        //console.log(first);
        var optGroupAct=Cluster.createNodeListGroup(first.l,[first]);
        var optGroupAva=Cluster.createNodeListGroup('Dostępne:',data);
            ele.appendChild(optGroupAct);
            ele.appendChild(optGroupAva);
            Cluster.setOnChange(ele);
    }
    static setOnChange(ele){
        ele.onchange = function(){
            console.log('Cluster::setOnChange:run:onChange');
            Cluster.updateList(this);
        };
    }
    static updateList(ele){
        console.log('CLUSTER::updateList');
        //console.log(ele.id);
        //console.log(ele.value);  
        /* CHECK I, IF THE SAME EXIT */
        if(Cluster[ele.id]['i']===ele.value){
            return '';
        }
        /* SET OLD VALUE */
        Cluster[ele.id]['i_old']=Cluster[ele.id]['i'];
        Cluster[ele.id]['n_old']=Cluster[ele.id]['n'];
        /* SET NEW VALUE */
        Cluster.getNewValue(ele);
        Cluster.rebuildDataObject(Cluster[ele.id]);
        Cluster.clear(ele);
        /* REBUILD SELECT */
        Cluster.createList(ele.id,Cluster[ele.id]['d']);
    }
    static getNewValue(ele){
        console.log('CLUSTER::getNewValue');
        Cluster[ele.id]['i']=ele.value;
        /* GET NAME FROM ARRAY */
        Cluster.getName(Cluster[ele.id],ele.value);
        //console.log( Cluster[ele.id]['n']);
        //console.log( Cluster[ele.id]);
    }
    static getName(data,i){
        console.log('CLUSTER::getName');
        for(const prop in data['d']){
            //console.log(data['d'][prop]);
            if(data['d'][prop]['i']=== i){
                /* SET NEW NAME */
                data['n']=data['d'][prop]['n']; 
            }
        }
    }
    static rebuildDataObject(data){
        console.log('CLUSTER::rebuildDataObject');
        console.log(data);
        for(const prop in data['d']){
            if(data['d'][prop]['i']=== data['i']){
                console.log('FOUND TO REMOVE:');
                console.log(data['d'][prop]);
                data['d'].splice(prop,1);
                break;
            }
        }
        /* ADD OLD ON END */
        console.log('ADD OLD VALUE:');
        console.log("i:"+data['i_old']+"\nn:"+data['n_old']);
        if(data['i_old']==='0'){
            /* DO NOT ADD EMPTY ON END = FIRST ELE IS EMPTY */
            return '';
        }
        data['d'].push(
                        {
                            i:data['i_old'],
                            n:data['n_old']
                        });
    }
    setPermissions(){
        Cluster.permissions=Cluster.data['data']['value']['perm'];
    }
    setClustrData(){
        //console.log(response);
        //console.log(this.data);
        Cluster.bookClusterNod0.d=Cluster.data['data']['value']['clusters'];
        Cluster.bookClusterNod1.d=Cluster.data['data']['value']['clusters'];
        Cluster.bookClusterLab.d=Cluster.data['data']['value']['labs'];
    }
    update(btn){
        console.log('CLUSTER::update');
        btn.onclick = function (){
            console.log('CLUSTER::update:click');
            Cluster.Ajax.setModulTask('updateAllocationTable');
            Cluster.Ajax.getData('updateClustr&n0='+Cluster.bookClusterNod0.i+'&n1='+Cluster.bookClusterNod1.i+'&p='+Cluster.bookClusterLab.i);
        };
    }
    setErr(info){
        console.log('CLUSTER::setErr');
        console.log(info);
        var errDiv=document.getElementById('bookClusterDivErr');
            errDiv.innerHTML=info;
            //console.log(errDiv);
        if(info!==''){
                errDiv.classList.remove("d-none");
        }
        else{
            errDiv.classList.add("d-none");
        }
        //console.log(errDiv);
    }
    checkResponseErr(){
        console.log('CLUSTER::checkResponseErr');
        console.log(Cluster.data);
        if(Cluster.data['status']===1){
            throw Cluster.data['info'];       
        }
    }
}

var Cl = new Cluster(new Ajax);
    Cl.setDefaultTask('getActClustrsUsage');
    Cl.loadData();
