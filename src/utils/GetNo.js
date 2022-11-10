

export  function GetUrlParams() {

    var full = window.location.href.split('?')[1];   
    var arry = full.split('&');
    var data={};
    for (let index = 0; index < arry.length; index++) {
        const element = arry[index].split('=');
        var val=decodeURI(element[1])
        console.log(val)
        data[element[0]]=val;
    }

    return data
}








function  nanoid(size = 21) {
    return Math.random().toString(36).substr(2);
    }  


export default nanoid