const DO_LOG:boolean = true;

export function logit(info) {
    if(DO_LOG)
        console.log(info);
    else
        return;    
}