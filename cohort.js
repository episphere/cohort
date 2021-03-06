console.log('cohort.js loaded')

cohort=function(){
    cohort.div=document.querySelector('#cohortDiv')
    if(cohort.div){
        //cohort header
        var ht=document.createElement('h2')
        ht.appendChild(cohort.cohortLogo({
            id:"headerLogo"
        })) // logo before the title
        var tt = document.createElement('i') // title
        tt.innerHTML=' DCEG Cohort Study <a href="https://github.com/episphere/cohort" target="_blank"><i class="fab fa-github-alt"></i></a> <span id="loginSpan" style="float:right;font-size:small;font-weight:normal;font-style:normal;color:navy"></span>'
        tt.style.color="cadetblue"
        tt.style.fontWeight="bold"
        ht.appendChild(tt)
        cohort.div.appendChild(ht)
        ht.querySelector('#headerLogo').click()
        
        cohort.msgDiv=document.createElement('div')
        cohort.div.appendChild(cohort.msgDiv)
        cohort.div.appendChild(document.createElement('hr'))
        // check if logged in 
        if(cohort.logged()){

        }else{
            cohort.boxDiv = document.createElement('div')
            cohort.boxDiv.innerHTML='<h2>BoxDrive</h2>'
            cohort.div.appendChild(cohort.boxDiv)
            cohort.boxdrive()   
            setTimeout(_=>{
                ht.querySelector('#headerLogo').click()
                if((location.search+location.hash).length==0){
                    var txt = 'Start by <a href="https://episphere.github.io/cohort/imgs/cohortBoxLogin.gif" target="_blank">loggin in</a> your account with <a href="https://dceg.cancer.gov" target="_blank">DCEG</a> Cohort Commons.'
                    cohort.msg(txt,{color:'navy'})
                }
            },1000)
        }
            
        //debugger
    }
    //debugger
}

// config parms in localStorage
if(!localStorage.cohortConfig){localStorage.cohortConfig='{}'}

cohort.cohortLogo=function(st){
    st=st||{}
    var logo=document.createElement('span')
    cohort.logo=logo
    logo.style.cursor="hand"
    logo.innerHTML='<i class="fas fa-info" style="font-size:large;font-style:italic"></i><i class="fas fa-info"  style="font-size:x-large;font-style:italic"></i><i class="fas fa-info" style="font-size:xx-large;font-style:italic"></i>'
    
    logo.style.color="cadetblue"
    logo.annimated=false
    // animation
    logo.onclick=function(){
        if(logo.annimated){
            logo.innerHTML='<i class="fas fa-info" style="font-size:large;font-style:italic"></i><i class="fas fa-info"  style="font-size:x-large;font-style:italic"></i><i class="fas fa-info" style="font-size:xx-large;font-style:italic"></i>'
            logo.annimated=false
        }else{
            logo.annimated=true
            for(let i of logo.querySelectorAll('i')){
                setInterval(function(){
                    switch(i.style.fontSize){
                        case "xx-large":
                            i.style.fontSize="x-large"
                            i.style.color="blue"
                            i.style.cursor="hand"
                            break
                        case "x-large":
                            i.style.fontSize="large"
                            i.style.color="orange"
                            i.style.cursor="hand"
                            break
                        default:
                             i.style.fontSize="xx-large"
                             i.style.color="green"
                             i.style.cursor="hand"

                    }
                },150)
            }
        }          
    }
    // styling
    Object.keys(st).forEach(k=>{
        logo[k]=st[k]
    })
        

        
    //debugger
    return logo
}

cohort.msg=function(txt,st,t){
    st=st||{}
    t=t||10 // time lag
    cohort.msgDiv.innerHTML=''
    Object.keys(st).forEach(k=>{
        cohort.msgDiv.style[k]=st[k]
    })
    if(t>0){
        var div = document.createElement('div')
        div.innerHTML=txt
        txt=div.textContent
        txt.split('').forEach((x,i)=>{
            setTimeout(_=>{
                cohort.msgDiv.textContent+=x
            },t*i)
        })
        setTimeout(_=>{
            cohort.msgDiv.innerHTML=div.innerHTML
            if(st.fun){st.fun()} // if callback function at st.fun 
        },(txt.length*t+t))
    }else{
        cohort.msgDiv.innerHTML=txt
    }
        
}


///////// BoxDrive /////////////

cohort.boxdrive=async function(div){
    div=div||cohort.boxDiv
    // am I logged in?
    div.innerHTML='<button type="button" class="btn btn-primary" id="boxLoginBt">Login your Box account</button>'

    if(!cohort.boxdrive.config){
        cohort.boxdrive.config={}
        if(location.hostname=="localhost"){
            cohort.boxdrive.config.client_id='52zad6jrv5v52mn1hfy1vsjtr9jn5o1w'
            cohort.boxdrive.config.server_id='2rHTqzJumz8s9bAjmKMV83WHX1ooN4kT' //<-- reset when proxy is deployed
        }else{
            cohort.boxdrive.config.client_id='1n44fu5yu1l547f2n2fgcw7vhps7kvuw'
            cohort.boxdrive.config.server_id='2ZYzmHXGyzBcjZ9d1Ttsc1d258LiGGVd' //<-- reset when proxy is deployed
        }
    }
    cohort.getParms() // <-- getting parameters here!
    div.querySelector('#boxLoginBt').onclick=function(){
        cohort.parms.stateIni=Math.random().toString().slice(2)
        localStorage.boxParms=JSON.stringify(cohort.parms)
        location.href=`https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${cohort.boxdrive.config.client_id}&redirect_uri=${location.origin}${location.pathname}&state=${cohort.parms.stateIni}`
    }

    // step 2 - get bearer token
    if(location.search.match('code=')&&(cohort.parms.state==cohort.parms.stateIni)){
        // get bearer token with POST https://developer.box.com/v2.0/reference#token
        /*
        var tk = (await fetch('https://api.box.com/oauth2/token',{
            method: "POST",
            data: {
                "grant_type": "authorization_code",
                "code":cohort.parms.code,
                "client_id":cohort.boxdrive.config.client_id,
                "client_secret":cohort.boxdrive.config.server_id
            }
        })).json()
        */
        var form = new FormData();
        form.append("grant_type", "authorization_code");
        form.append("client_id", cohort.boxdrive.config.client_id);
        form.append("client_secret", cohort.boxdrive.config.server_id);
        form.append("code", cohort.parms.code);
        form.append("state", cohort.parms.state);
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.box.com/oauth2/token",
          "method": "POST",
          "headers": {
            "Cache-Control": "no-cache"
          },
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": form
        }
        $.ajax(settings)
         .done(function (response) {
             localStorage.boxParms=response
             cohort.logged(response)
             console.log(`looged in at ${Date()}`)
         })
    }

}

cohort.logged=(resp)=>{
    // error handling missing
    // ...
    var y = false

    //not logged in time
    if(typeof(resp)!=='undefined'){ // if just logged in 
        resp=JSON.parse(resp)
        resp.date=Date.now()
        localStorage.boxParms=JSON.stringify(resp)
        location.href=location.origin+location.pathname // this will also interrupt workflow, as it should
        y=true
    }else{
        // check if active login available
        if(localStorage.boxParms){
            var bp=JSON.parse(localStorage.boxParms)
            if(((Date.now()-bp.date)/1000)<(bp.expires_in-60)){ // yes, there is a valid login
                cohort.boxUI()
                y=true
            }else{ // no, need to login again
                if(!bp.stateIni){
                    localStorage.removeItem('boxParms')
                    location.href=location.origin+location.pathname
                }
            }
        }
            
    }
    //     

    return y
}

///////// BoxUI //////////

cohort.boxUI=function(){
    if(!cohort.boxDiv){
        cohort.boxDiv=document.createElement('div')
        cohort.div.appendChild(cohort.boxDiv)
        cohort.boxDiv.id="boxDiv"

    }
    // https://github.com/allenmichael/box-javascript-sdk
    cohort.boxParms=JSON.parse(localStorage.boxParms)
    cohort.box= new BoxSdk();
    cohort.boxClient = new cohort.box.BasicBoxClient({accessToken: cohort.boxParms.access_token});
    //bp.access_token
    //cohort.boxMe=cohort(await fetch('https://api.box.com/2.0/users/me',{headers: {Authorization:'Bearer m6P1WG2vTONSlQm7qSjxs653ffeGhdFh'}})).json()
    var h = '<p>Make sure this is indeed you ...</p>'
    h += '<pre id="loggedInAsPre" style="color:green"></pre>'
    h += '<p id="loggedInAsPreMore" hidden=true>... and note that this application can now act on your behalf to perform QA/GC on file contents, find out what projects you are a member, help you manage the files you are contributing, engage you in managing access by your collaborators, and even analyse the data available to produce real-time interactive visualizations.</p>'
    cohort.boxDiv.innerHTML=h
    fetch(
        'https://api.box.com/2.0/users/me',
        {headers: {
            Authorization:'Bearer '+cohort.boxParms.access_token}
        }).then(x=>x.json().then(function(x){
            cohort.me=x
            loginSpan.innerHTML=`${cohort.me.name} (${cohort.me.login}) <button id="logoutBt" style="color:red">logout</button>`
            logoutBt.onclick=function(){
                localStorage.clear()
                location.search=''
            }
            var cohortConfig = JSON.parse(localStorage.cohortConfig)
            if(cohortConfig.dontShowUserInfo){
                boxDiv.textContent='...'
                cohort.boxFolderUI()
            }else{
                loggedInAsPre.textContent=JSON.stringify(x,null,3)
                loggedInAsPreMore.hidden=false
                if(cohort.logo.annimated){cohort.logo.click()}
                cohort.msg('Check info below, then <button id="continueFromLogin" style="color:blue;background-color:yellow">continue</button> <span style="color:maroon"><input id="dontShowUserInfo" type="checkbox"><i class="fa fa-arrow-left" aria-hidden="true"></i> don\'t show this again</span>.',
                   {
                    color:'navy',
                    fun:function(){
                        cohort.logo.click()
                        continueFromLogin.onclick=function(){
                            boxDiv.textContent='...'
                            cohort.boxFolderUI()
                        }
                        //debugger
                        dontShowUserInfo.onclick=function(){
                            var cohortConfig = JSON.parse(localStorage.cohortConfig)
                            cohortConfig.dontShowUserInfo=true
                            localStorage.cohortConfig=JSON.stringify(cohortConfig)
                        }
                   }
                })
                //cohort.msg('logged in as '+cohort.me.name+', details below <button id="logoutBt"style="backgroud-color:yellow;color:red" onclick="localStorage.clear">logout</button>.',{color:'maroon'})
                
            }
                
            /*
            setTimeout(_=>{
                continueFromLogin.onclick=function(){
                    cohort.logo.click()
                    boxDiv.textContent='...'
                    cohort.boxFolderUI()
                }
            },2000)
            */
        }))
    //debugger
}

cohort.epiSphereDriveBox='62735098034' // <-- address of Box.com Drive folder

cohort.boxFolderUI=function(div){
    div=div||cohort.boxDiv
    // check that user has access to drive
    cohort.getJSON(`https://api.box.com/2.0/folders/${cohort.epiSphereDriveBox}/items`)
        .then(x=>{
            div.innerHTML='Search <input> <i class="fas fa-search"></i>'
            var hr = document.createElement('hr')
            hr.style.borderColor="navy"
            div.appendChild(hr)
            //cohort.boxDiv.innerHTML=`<p>The following cohort study projects were found your <a href="https://app.box.com/folder/${cohort.epiSphereDriveBox}" target="_blank">epiSphere drive</a>:</p>`
            cohort.msg(`<p>${x.entries.length} entries were found in your <a href="https://app.box.com/folder/${cohort.epiSphereDriveBox}" target="_blank">epiSphere drive</a>:</p>`)
            if(cohort.logo.annimated){cohort.logo.click()}
            var ol = document.createElement('ol')
            div.appendChild(ol)
            x.entries.forEach(function(xi,i){
                var li = document.createElement('li')
                li.id="studyLi_"+i
                var h=`<h4 style="color:maroon"><a href="https://app.box.com/folder/${xi.id}" target="_bank"><i class="fas fa-archive"></i></a> ${xi.name} <span style="font-size:small">[<a id="viewFolder" href="#" style="color:green">view</a>]</span></h4>`
                li.innerHTML=h
                li.xi=xi // just in case we want to use "this" later
                ol.appendChild(li)
                li.querySelector('#viewFolder').onclick=cohort.viewFolder
                //debugger
            })
            var hr = document.createElement('hr')
            hr.style.borderColor="navy"
            div.appendChild(hr)
            //debugger
        })
        .catch(e=>{
            cohort.logo.click()
            div.innerHTML='You don\'t appear to have an account with epiSphere. If this is not right please contact <a href="mailto:jonas.almeida@stonybrookmedicine.edu">jonas.dealmeida@nih.gov</a>.'
            if(cohort.logo.annimated){cohort.logo.click()}
        })   
}

cohort.viewFolder=function(){
    if(this.textContent=="view"){
        this.textContent="hide"
        var li = this.parentElement.parentElement.parentElement
        // make sure view div is created already
        var viewFolderDiv=li.querySelector('.viewFolderDiv')
        if(!viewFolderDiv){
            viewFolderDiv=document.createElement('div')
            viewFolderDiv.classList.add('viewFolderDiv')
            li.appendChild(viewFolderDiv)
        }
        // fill it with entries
        cohort.getJSON(`https://api.box.com/2.0/folders/${li.xi.id}/items`)
        .then(xii=>{
            viewFolderDiv.innerHTML=`<p>Found ${xii.total_count} entries shared with you:</p>`
            var ol=document.createElement('ol')
            viewFolderDiv.appendChild(ol)
            viewFolderDiv.appendChild(document.createElement('hr'))
            xii.entries.forEach(x=>{
                var li=document.createElement('li')
                li.xi=x
                ol.appendChild(li)
                if(x.type=='folder'){
                    li.innerHTML=`<a href="https://app.box.com/${x.type}/${x.id}?sidebar=metadata&tab=properties" target="_blank"><i class="fas fa-archive"></i> <span style="color:maroon">${x.name}</span></a><span style="color:maroon"> <span>[<a href="#" class="folder" style="color:green">view</a>]</span></span>`
                    var folder=li.querySelector('.folder')
                    folder.onclick=cohort.viewFolder
                    //debugger
                }else{ // file
                    li.innerHTML=`<a href="https://app.box.com/${x.type}/${x.id}?sidebar=metadata&tab=properties" target="_blank">${x.name}</a> [<a href="#" class="file" style="color:green">view</a>]`
                    var file=li.querySelector('.file')
                    file.onclick=cohort.viewFile
                }
                
                //debugger
            })
        })
    }else{
        this.textContent="view"
        var listDiv=this.parentElement.parentElement.parentElement.querySelector('div')
        listDiv.remove()
        //debugger
    }
        
    
}

cohort.viewFile=function(){
    var li=this.parentElement
    if(this.text=="view"){
        this.text="hide"
        var ifr = document.createElement('iframe')
        var div = document.createElement('div')
        div.class="viewIframeDiv"
        div.style.height="800px"
        li.appendChild(div)
        div.innerHTML=`<iframe src="https://nih.app.box.com/embed/${li.xi.type}/${li.xi.id}?tab=properties" frameborder="0" allowfullscreen webkitallowfullscreen msallowfullscreen width="100%" height="100%"></iframe>`
    }else if(this.text=="hide"){
        this.text="show"
        this.style.color="orange"
        this.parentElement.querySelector('div').hidden=true
        //debugger
    }else{ // show
        this.text="hide"
        this.style.color="orange"
        this.parentElement.querySelector('div').hidden=false
    }
    
    //debugger
}

cohort.getJSON=async function(url){
    return (await fetch(url,{headers: {Authorization:'Bearer '+JSON.parse(localStorage.boxParms).access_token}})).json()
}


///////// INI ////////////

window.onload=cohort

// get parameters, default uses both hash and search
cohort.getParms=(str)=>{
    str=str||(location.search.slice(1)+location.hash)
    if((location.search.length>1)&(location.hash.length>1)){
        str=str.replace('#','&')
    }else if((location.search.length==0)&(location.hash.length>0)){
        str=str.slice(1)
    }
    cohort.parms={}
    str.split('&').forEach(kv=>{
        kv=kv.split('=')
        cohort.parms[kv[0]]=kv[1]
    })
    // add any new parameters kept at localstorage
    if(localStorage.boxParms){
        let moreParms=JSON.parse(localStorage.boxParms)
        Object.keys(moreParms).forEach(k=>{
            if(!cohort.parms[k]){
                cohort.parms[k]=moreParms[k]
            }
        })
        //debugger
    }

}

