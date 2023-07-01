function handleNowTime (){
    var dateFormat= new Date()
    let timeResult = `${dateFormat.getFullYear()} tháng ${(dateFormat.getMonth()+1)} ngày ${dateFormat.getDate()}`
   
    return timeResult
}

export default handleNowTime