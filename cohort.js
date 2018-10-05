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
        tt.textContent=' Cohort Study'
        tt.style.color="cadetblue"
        tt.style.fontWeight="bold"
        ht.appendChild(tt)
        cohort.div.appendChild(ht)
        ht.querySelector('#headerLogo').click()
        
        cohort.msgDiv=document.createElement('div')
        cohort.div.appendChild(cohort.msgDiv)
        cohort.div.appendChild(document.createElement('hr'))
        setTimeout(_=>{
            ht.querySelector('#headerLogo').click()
            var txt = 'Start by <a href="#">loggin in</a> your account with DCEG Cohort <button type="button" class="btn btn-success">epicommons</button>.'
            cohort.msg(txt,{color:'navy'})
        },1000)
        //debugger
    }
    //debugger
}

cohort.cohortLogo=function(st){
    st=st||{}
    var logo=document.createElement('span')
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
        },(txt.length*t+t))
    }else{
        cohort.msgDiv.innerHTML=txt
    }
        
}


window.onload=cohort
