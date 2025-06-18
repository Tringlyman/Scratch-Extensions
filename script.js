const avaibleDocs = ["Tringlyman_s_JSON_Utilities"]
function DocURIs(ext){
    if(avaibleDocs.includes(ext)){
        window.open('/documents/' + ext + ".html" ,"_blank")
    }
    else{
        alert('invalid!')
    }
}