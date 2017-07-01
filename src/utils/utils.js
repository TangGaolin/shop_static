export function formatDate(date, format){

    var tf = function(i){
        return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(date.getUTCFullYear());
                break;
            case 'MM':
                return tf(date.getUTCMonth() + 1); // 返回 用世界时表示时的月份，该值是 0（一月） ~ 11（十二月） 之间中的一个整数。所以要加1
                break;
            case 'mm':
                return tf(date.getUTCMinutes());
                break;
            case 'dd':
                return tf(date.getUTCDate());
                break;
            case 'HH':
                return tf(date.getUTCHours());
                break;
            case 'ss':
                return tf(date.getUTCSeconds());
                break;
        };
    });
};