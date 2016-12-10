

//--- INIZIALIZZAZIONE - COSTRUTTORE ---//
var drawChart = function(login, session, url)
{
    this.login = login; // DATI LOGIN
    this.session = session; //DATI SESSIONE
    this.baseUrl = url; // URL BASE
    this.url = url; // URL INIZIALE
    
    this.uSeriesName;
    this.Y_maxRange_A;
    this.Y_maxRange_B;
    this.Y_numAxis_A;
    this.Y_numAxis_B;
    this.hideSeries = new Array();
    
    this.filterUri = null;
    this.mcrData = null;
    this.chartTitle = null;
    this.expFileName = null;
    
    this.reset_FilterUri();
}

drawChart.prototype.add_FilterUri = function(key, value)
{
    this.filterUri[key] = value;
}

drawChart.prototype.reset_FilterUri = function()
{
    this.filterUri = new Object();
}

drawChart.prototype.setMCR = function (mcrValue)
{
    this.mcrData = mcrValue;
}

drawChart.prototype.setChartTitle = function (titleValue)
{
    this.chartTitle = titleValue;
    this.expFileName = titleValue.split(' ').join(""); 
}


drawChart.prototype.Highcharts_setOptions = function(seriesName)
{
    Highcharts.setOptions({
        global: {
            /**
             * Use moment-timezone.js to return the timezone offset for individual
             * timestamps, used in the X axis labels and the tooltip header.
             */
            getTimezoneOffset: function (timestamp) {
                // var zone = 'Europe/Rome',
                // timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                timezoneOffset = - 60;
                return timezoneOffset;
            }
        },
        lang:{
            weekdays: ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato']
        }
    });
    
     scaleColor = new Array();
     if(seriesName[0] == 'cpu1Min' || seriesName[0] == 'download')
     {
        scaleColor[0] = 'black';
        scaleColor[1] = 'black';
     }
     else
     {
         scaleColor[0] = seriesColor[0];
         scaleColor[1] = seriesColor[1];
     }
     return scaleColor;
    
}

//--- PREPARAZIONE dati per SERIE ---//
drawChart.prototype.getURL = function(id, hours, type, force, div, divNav, divPrinc)
{

    
    seriesOptions = new  Object(); //ARRAY PUNTI
    seriesLabel = new Object(); //ARRAY LABEL
    force = force; //VAR FORZATURA MOB/DESK
    
    seriesName = new Array(); // ARRAY NOMI SERIE
    seriesColor = new Array(); //ARRAY COLORI SERIE
    seriesType = new Array(); // ARRAY TIPO SERIE
    
    this.setUrl(type);
    seriesInfo = this.setDraw_Series(seriesName,seriesType,seriesColor,type);
    seriesName = seriesInfo[0];
    seriesType= seriesInfo[1];
    seriesColor = seriesInfo[2];
    
    seriesLabel = this.getLang(div,seriesLabel,divPrinc);
    
    //Set type
    $(divNav).find("#inputTypeChart").val(type);
    
    var len = (seriesName.length);
    for(x = 0; x < len; x++)
    {
        this.getJSON(x ,len , seriesName[x], id, hours, div, divNav, seriesOptions, seriesLabel, seriesName, seriesColor, seriesType, force, divPrinc);
    }
}

//--- CREAZIONE URL e SET ARRAY SERIE ---//
//drawChart.prototype.setUrl = function(seriesName, seriesType, seriesColor, type)
drawChart.prototype.setUrl = function(type)
{
    switch (type)
    {
        case 'metrica_td':
            this.url = this.baseUrl + '/metrica_td';
            break;
        case 'cpu':
            this.url = this.baseUrl + '/cpu';
            break;
        case 'mrtg':
            this.url = this.baseUrl + '/mrtg';
            break;
        case 'qos':
            this.url = this.baseUrl + '/qos';
            break;            
    }
}


drawChart.prototype.setDraw_Series = function(seriesName, seriesType, seriesColor, type)
{
    switch (type)
    {
        case 'metrica_td':
            seriesName = ['tempo_medio','degrado'];
            seriesType = ['line','area'];
            seriesColor[0] = '#7cb5ec';
            seriesColor[1] = '#f15c80';
            
            this.Y_minRange_A = 0;
            this.Y_maxRange_A = null;
            
            this.Y_minRange_B = 0;
            this.Y_maxRange_B = 1000;
            
            this.Y_numAxis_A = 0;
            this.Y_numAxis_B = 1;
            
            break;
        case 'cpu':
            seriesName = ['cpu1Min','cpu5Min'];
            seriesType = ['line','area'];
            seriesColor[0] = '#f15c80';
            seriesColor[1] = '#00cc00';
            
            this.Y_minRange_A = 0;
            this.Y_maxRange_A = null;
            
            this.Y_minRange_B = 0;
            this.Y_maxRange_B = null ;
            
            this.Y_numAxis_A = 0;
            this.Y_numAxis_B = 0;
            break;
        case 'mrtg':
            seriesName = ['download','upload'];
            seriesType = ['line','area'];
            seriesColor[0] = '#00cc00';
            seriesColor[1] = '#7cb5ec';
            
            this.Y_minRange_A = 0;
            this.Y_maxRange_A = null;
            
            this.Y_minRange_B = 0;
            this.Y_maxRange_B = null;
            
            this.Y_numAxis_A = 0;
            this.Y_numAxis_B = 0;
            
            break;
        case 'qos':
            seriesName = ['matched','discarded'];
            seriesType = ['line','area'];
            seriesColor[0] = '#00cc00';
            seriesColor[1] = '#f15c80';
            
            this.Y_minRange_A = 0;
            this.Y_maxRange_A = null;
            
            this.Y_minRange_B = 0;
            this.Y_maxRange_B = null;
            
            this.Y_numAxis_A = 0;
            this.Y_numAxis_B = 0;
            
            this.hideSeries.push(0);
            break;            
        default:
            return;
    }
    var seriesInfo = [seriesName,seriesType,seriesColor];
    this.uSeriesName = seriesName;
    return seriesInfo;
}

//--- RICHIESTA e PREPARAZIONE per LABELS ---//
drawChart.prototype.getLang = function(div, seriesLabel, divPrinc)
{
    var params = new Object();
    // params['output_type'] = output_type;
    var urlJSON = this.buildUrl("lang", null, params); 

    $.ajax(
    {
        // url: this.url + '/lang' + '?login=' + this.login + '&cookie=' + this.session,
        url: urlJSON,
        dataType: 'json',
        async: false,
        success: function(data) 
        {
            seriesLabel = data;
        },
        error: function() {
            drawChart.errorExit(div,divPrinc,'lang');
        }
    });
    return seriesLabel;
}

drawChart.prototype.buildUrl = function(type, td_id, parameters)
{
    var add_Get = "td_id=" + td_id ;
    for (var param in parameters)
    {
        add_Get = add_Get + "&" + param + "=" + parameters[param] ;
    }
    
    for (var param in this.filterUri)
    {
        add_Get = add_Get + "&" + param + "=" + this.filterUri[param] ;
    }
    
    url =  this.url + "/" + type + "?" + add_Get + '&login=' + this.login + '&cookie=' + this.session;
    // console.log( url );
    return url;
}

//--- RICHIESTA JSON per SERIE ---//
drawChart.prototype.getJSON = function (x ,len, name, id, hours, div, divNav, seriesOptions,  seriesLabel, seriesName, seriesColor, seriesType, force, divPrinc)
{
    var params = new Object();
    params['x_hours'] = hours;
    params['output_type'] = name;
    var urlJSON = this.buildUrl("get", id, params);

    $.ajax(
    {
//        url: this.url + '/get?td_id=' + id + '&x_hours=' + hours +'&output_type=' + name + '&login=' + this.login + '&cookie=' + this.session,
        url: urlJSON,     
        dataType: 'json',
        async: false,
        success: function(data) 
        {
            seriesOptions[x] = data;
        },
        complete : function()
        {
            if(x == (len-1) && seriesOptions[x] != null )
            {
                drawChart.setData(div, divNav,seriesOptions, seriesLabel, seriesName, seriesColor, seriesType, force, divPrinc);
            }
        },
        error: function() { drawChart.errorExit(div,divPrinc,'srv_offline'); }
    });

}

//--- SET DATA CONVERTITA per NAVBAR ---//
drawChart.prototype.setData = function(div, divNav, seriesOptions,  seriesLabel, seriesName, seriesColor, seriesType, force, divPrinc)
{
    try
    {
        var first = seriesOptions[0][0];
        var len = (seriesOptions[0]).length-1;
        var last = seriesOptions[0][len];

        var firstD = new Date(first[0]); //Prima data array
        var lastD = new Date(last[0]); //Ultima data array
        
        //Formattazione prima data
        var finalFirst = this.formatData(firstD);
    
        //Formattazione ultima data
        var finalLast = this.formatData(lastD);
        var finalLastSPLIT = finalLast.split(" ");
    
        //Formattazione data ATTUALE
        data = new Date();
        if(data.getDate()<10){ d = "0" + (data.getDate()).toString(); }
        else{ d = data.getDate().toString();}
                
        if((data.getMonth()+1)<10){ m = "0" + (data.getMonth()+1).toString(); }
        else{ m = (data.getMonth()+1).toString();}
        y = (data.getFullYear()).toString();
        var now = d + '/' + m + '/' + y;
    
        if(now == finalLastSPLIT[0])
        {
            //Aggiornamento prima Label
            $(divNav).find("#lab1").html("Start: "+finalFirst);
            $(divNav).find("#inputFirst").val(finalFirst);
            //Aggiornamento seconda Label
            $(divNav).find("#lab2").html("End : "+finalLast);
            $(divNav).find("#inputLast").val(finalLast);
            $(divNav).find("#inputNext").val(finalLast);
            
            //Set next icon
            $(divNav).find("#next").attr("onClick","");
            $(divNav).find("#next").attr("src","../img/next_2.png");
            $(divNav).find("#next").attr("style","cursor:auto;");
            
        }
        else
        {
            //Aggiornamento prima Label
            $(divNav).find("#lab1").html("Start: "+finalFirst);
            $(divNav).find("#inputFirst").val(finalFirst);
            //Aggiornamento seconda Label
            $(divNav).find("#lab2").html("End : "+finalLast);
            $(divNav).find("#inputLast").val(finalLast);
            
            $(divNav).find("#next").attr("onClick","drawChart.getChartEvents('next',idLinea,hours,typeChart,force,divChart,divNavigator,divPrinc);");
            $(divNav).find("#next").attr("src","../img/next.png");
            $(divNav).find("#next").attr("style","cursor:pointer;");
        }
        this.getDisplay(div, divNav, seriesOptions,  seriesLabel, seriesColor, seriesType, force, divPrinc);
    }
    catch(err)
    {
        this.errorExit(div,divPrinc,'no_data');
    }
}

// --- Conversione DATA da unixtimestap to DB format --- //
drawChart.prototype.formatData = function(unixFormat,method)
{
    if (unixFormat) {
        if(unixFormat.getDate()<10){ d = "0" + (unixFormat.getDate()).toString();}
        else{ d = unixFormat.getDate().toString();}
                
        if((unixFormat.getMonth()+1)<10){ m = "0" + (unixFormat.getMonth()+1).toString();}
        else{ m = (unixFormat.getMonth()+1).toString();}
        
        y = (unixFormat.getFullYear()).toString();

        if((unixFormat.getHours()-1) < 10){ h = "0" + (unixFormat.getHours()-1).toString();}
        else{ h = (unixFormat.getHours()-1).toString();}
        
        if(unixFormat.getMinutes()<10){ min = "0" + (unixFormat.getMinutes()).toString();}
        else{ min = unixFormat.getMinutes().toString();}
        
        if(unixFormat.getSeconds()<10){ s = "0" + (unixFormat.getSeconds()).toString();}
        else {s = unixFormat.getSeconds().toString();}
        var format = d + '/' + m + '/' + y + " " + h + ":" + min + ":" + s;

        if (method=="all"){ var format = d + '/' + m + '/' + y + " " + h + ":" + min + ":" + s;}
    
        var space = format.split (" ");
    
        if (method == "data"){ format = space[0];}
        if(method == "ora"){ format = space[1];}
    
        return format;
    }
    else{return;}
}


//--- RILEVAMENTO GRANDEZZA DISPLAY ---//
drawChart.prototype.getDisplay = function(div, divNav, seriesOptions,  seriesLabel, seriesColor, seriesType, force, divPrinc) 
{
    // force 1: mobile - force 2: desktop //
    var width = $(document).width(), height = $(document).height();
    switch (force)
    {
        case 1:
            this.mobileChart(div, divNav,seriesOptions,  seriesLabel, seriesColor, seriesType, divPrinc);
            break;
        case 2:
            this.createChart(div, divNav,seriesOptions,  seriesLabel, seriesColor, seriesType, divPrinc);
            break;
        default:
            this.createChart(div, divNav,seriesOptions,  seriesLabel, seriesColor, seriesType, divPrinc);
    }
    //caricamento solo per risoluzione del display
    //if ((width <= 1024) && (height <= 768) && this.force == 1) 
    //{
    //    
    //    //this.mobileChart(div);
    //} 
    //else 
    //{
    //     this.createChart(div);
    //}   
}

//--- RICHIESTA JSON e CREAZIONE file EXCEL ---//
drawChart.prototype.exportXLS = function (id, hours)
{
    var primo = this.uSeriesName[0];
    var secondo = this.uSeriesName[1];
    var utc = new Date();
    
    var params = new Object();
    params['x_hours'] = hours;
    var urlJSON = this.buildUrl("lang", id, params); 
        
    $.ajax(
    {
        //url: this.url + '/get?td_id=' + id + '&x_hours=' + hours + '&login=' + this.login + '&cookie=' + this.session,
        url: urlJSON,
        dataType: 'json',
        // async: false,
        success: function(data) 
        {
            var out = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN'><html lang=it><head><title></title></head><body><table border='1' bordercolor='gray'><tr><td>TIME</td><td>AVERAGE</td><td>LOST</td></tr>";
            for(var i = 0; i < data.length; i++) 
            {
                t = ((data[i][primo]).toString()).replace(".",",");
                d = ((data[i][secondo]).toString()).replace(".",",");
                out += "<tr><td>" + 
                data[i]['timestamp'] +
                "</td><td>" +
                t +
                "</td><td>" +
                d +
                "</td></tr>";
            }
            out += "</table>";
            uri = 'data:application/vnd.ms-excel,' + encodeURIComponent(out)
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.download = "sherlogic_" + utc +".xls";
            link.href = uri;
            link.click();
            document.body.removeChild(link);

        },
        error: function() { (div).htm("<h4 style='text-align:center'>Error to get Excel file, please refresh the page.</h4>"); }
    });
}

//--- CALCOLO DATA per il SHIFT ---//
drawChart.prototype.getData = function (interval, shift, id, type, force, div, divNav, divPrinc)
{
    var first = $(divNav).find("#inputFirst").val();
    var last = $(divNav).find("#inputLast").val();

    if(shift == "back")
    {
            var hours = interval;
            var space = first.split(" ");
            var first = space[0].split("/");
            var finalFirst = first[2] + '-' + first[1] + '-' + first[0] + " " + space[1];
            this.getURLInit(id, hours, type, force, div, divNav, finalFirst, divPrinc);
    }
    else if(shift == "next")
    {
        if(interval == '169' || interval == '24')
        {
            var somma = 0;
            switch(interval)
            {
                case '24':
                    somma = 1;
                    break;
                case '169':
                    somma = 7;
                    break;
                default:
                    somma = 1;
            }

            var hours = interval;
            var space = last.split(" ");
            var last = space[0].split("/");
            var nextDate = new Date(last[2], last[1]-1, last[0]);
            nextDate.setDate(nextDate.getDate() + somma); //Aggiungo intervallo

            if(nextDate.getDate()<10){ d = "0" + (nextDate.getDate()).toString(); }
            else{ d = nextDate.getDate().toString();}
                    
            if((nextDate.getMonth()+1)<10){ m = "0" + (nextDate.getMonth()+1).toString(); }
            else{ m = (nextDate.getMonth()+1).toString();}
            y = (nextDate.getFullYear()).toString();
            var finalNext = y + '-' + m + '-' + d + " " + space[1];


            this.getURLInit(id, hours,type, force, div, divNav, finalNext, divPrinc);
        }
        else if(interval == '721')
        {
            var hours = interval;
            var space = last.split(" ");
            var last = space[0].split("/");
            var nextDate = new Date(last[2], last[1]-1, last[0]);
            nextDate.setDate(nextDate.getMonth()+1); //Aggiungo un mese

            if(nextDate.getDate()<10){ d = "0" + (nextDate.getDate()).toString(); }
            else{ d = nextDate.getDate().toString();}
                    
            if((nextDate.getMonth()+1)<10){ m = "0" + (nextDate.getMonth()+1).toString(); }
            else{ m = (nextDate.getMonth()+1).toString();}
            y = (nextDate.getFullYear()).toString();
            var finalNext = y + '-' + m + '-' + d + " " + space[1];


            this.getURLInit(id, hours, type, force, div, divNav, finalNext, divPrinc);
        }
    }
}

//--- RICARICA TUTTO con RANGE DATA ---//
drawChart.prototype.getURLInit = function(id, hours, type, force, div, divNav, data, divPrinc)
{
    seriesOptions = new  Object(); //ARRAY PUNTI
    seriesLabel = new Object(); //ARRAY LABEL
    force = force; //VAR FORZATURA MOB/DESK
    
    seriesName = new Array(); // ARRAY NOMI SERIE
    seriesColor = new Array(); //ARRAY COLORI SERIE
    seriesType = new Array(); // ARRAY TIPO SERIE
    try
    {
        this.setUrl(type);
        seriesInfo = this.setDraw_Series(seriesName,seriesType,seriesColor,type);
        seriesName = seriesInfo[0];
        seriesType= seriesInfo[1];
        seriesColor = seriesInfo[2];
        
        seriesLabel = this.getLang(div,seriesLabel);
        
        var len = (seriesName.length);
    }
    catch(err)
    {
            this.errorExit(div,divPrinc,'no_data');
    }

    for(x = 0; x < len; x++)
    {
        var params = new Object();
        params['x_hours'] = hours;
        params['t_init'] = data;
        params['output_type'] = seriesName[x];
        var urlJSON = this.buildUrl("get", id, params);    
        
        $.ajax(
        {
           //  url: this.url + '/get?td_id=' + id + '&x_hours=' + hours + '&t_init=' + data +'&output_type=' + seriesName[x] + '&login=' + this.login + '&cookie=' + this.session,
            url: urlJSON,
            dataType: 'json',
            async: false,
            success: function(data) 
            {
                seriesOptions[x] = data;
            },
            complete: function()
            {
                if(x == (len-1))
                {
                    drawChart.setData(div, divNav,seriesOptions, seriesLabel, seriesName, seriesColor, seriesType, force, divPrinc);
                }
            },
            error: function() { this.errorExit(div,divPrinc,'srv_offline'); }
        });
    }
}

//drawchart.prototype.setMaxRange = function(seriesName,seriesOptions)
//{
//    var maxRangeX;
//    var maxRangeY;
//    for( x=0; x<seriesName.length;x++)
//    {
//        for( y=0; y<seriesOptions.seriesName[i]; y++)
//        {
//            
//        }
//    }
//}

// --- GESTIONE EVENTI MENU NAVIGAZIONE --- //
drawChart.prototype.getChartEvents = function(input,idLinea,hours,type,force,divChart,divNav,divPrinc)
{

    var img = "<center><br><img src='../img/load.gif' style='width:64px;heigth:64px;'/><br><h5><b>Processing...</b></h5></center>";
    
    var interval = $(divNav).find("#interval").val();
    switch (input)
    {
        case 'downloadXLS':
            this.exportXLS(idLinea,hours);
            break
        case 'refreshPage':
            window.location.reload();
            break
        case 'refreshChart':
            $(divChart).html(img);
            switch (interval)
            {
                case "25":
                    hours= 25;
                    break;
                case "169":
                    hours = 169;
                    break
                case "721":
                    hours = 721;
                    break
                default:
                    hours = 169;
            }
            type = $(divNav).find("#inputTypeChart").val();
            this.getURL(idLinea,hours,type,force,divChart,divNav,divPrinc);	
            break
        case 'next':
            var shift = "next";
            $(divChart).html(img);
            this.getData(interval,shift,idLinea,type,force,divChart,divNav,divPrinc);
            break
        case 'back':
            var shift = "back";
            $(divChart).html(img);
            this.getData(interval,shift,idLinea,type,force,divChart,divNav,divPrinc);
            break
        case 'getCPU':
            $(divChart).html(img);
            switch (interval)
            {
                case "169":
                    hours = 169;
                    break
                case "721":
                    hours = 721;
                    break
                default:
                    hours = 169;
            }
            type = 'cpu';
            this.getURL(idLinea,hours,type,force,divChart,divNav,divPrinc);	
            break
        case 'getMRTG':
            $(divChart).html(img);
            switch (interval)
            {
                case "169":
                    hours = 169;
                    break
                case "721":
                    hours = 721;
                    break
                default:
                    hours = 169;
            }
            type = 'mrtg';
            this.getURL(idLinea,hours,type,force,divChart,divNav,divPrinc);		
            break
        case 'getDGD':
            $(divChart).html(img);
            switch (interval)
            {
                case "169":
                    hours = 169;
                    break
                case "721":
                    hours = 721;
                    break
                default:
                    hours = 169;
            }
            type = 'metrica_td';
            this.getURL(idLinea,hours,type,force,divChart,divNav,divPrinc);
            break
        default:
            return;
    }
}



//--- CREAZIONE GRAFICO DESKTOP ---//
drawChart.prototype.createChart = function(div, divNav, seriesOptions,  seriesLabel, seriesColor, seriesType)
{
    this.Highcharts_setOptions(seriesName);
    scaleColor = this.Highcharts_setOptions(seriesName);
    
    
    $(div).highcharts('StockChart', 
        {
            chart:
            {
                backgroundColor: 'rgba(255,255,255,.1)'
            },
            credits: {
                 enabled: false
            },
            legend: 
                {
                    enabled: true,
                    //backgroundColor: '#FCFFD5',
                    // borderWidth: 0.5,
                    // borderColor: 'black',
                    verticalAlign: 'rigth',
                    align: 'rigth',
                    y: 300,
                    x: 50,
                    shadow: true
                },
                plotOptions: 
                {
                    series: 
                    {
                        animation: 
                        {
                            duration: 2000,
                            easing: 'swing'
                        },
                        turboThreshold:0,
                        threshold: 0,
                        gapSize: null                
                    }
                },
                title: { text: this.chartTitle},
                subtitle: {text: seriesLabel.sottotitolo},
                xAxis: 
                {
                    gapGridLineWidth: null,
                    title:
                    {
                        text: '<i>'+seriesLabel.x_axis+'</i>',
                        style: {color: 'black'}
                    },
                        
                },
                yAxis:
                [
                        { // asseY_A
                              title: 
                                {
                                    text: seriesLabel.y_axis_a,
                                    style: {color: seriesColor[0]}
                                },
                                labels: 
                                {
                                    format: '{value}',
                                    style: {color: scaleColor[0]}
                                },
                                min: this.Y_minRange_A,
                                max: this.Y_maxRange_A,
                                lineColor: 'black',
                                lineWidth: 2,
                                // alternateGridColor: '#FDFFD5',
                                opposite: false
                        },
                        { // asseY_B
                                title: 
                                {
                                    text: seriesLabel.y_axis_b ,
                                    style: {color: seriesColor[1]}
                                },
                                labels: 
                                {
                                    format: '{value} ',
                                    style: {color: scaleColor[1]}
                                },
                                min: this.Y_minRange_B,
                                max: this.Y_maxRange_B,
                                lineColor: 'black',
                                lineWidth: 2,
                                opposite: true,
                                
                        },
                        {
                        plotLines:
                            {
                                value: 500,
                                color: 'green',
                                dashStyle: 'shortdash',
                                width: 2,
                                label:
                                {
                                    text: 'Minimum'
                                }
                            },
                        }      
                ],

                rangeSelector : 
                {
                    buttons : 
                    [
                        {
                            type : 'hour',
                            count : 3,
                            text : '3h'
                        }, 
                        {
                            type : 'hour',
                            count : 6,
                            text : '6h'
                        }, 
                        {
                            type : 'hour',
                            count : 12,
                            text : '12h'
                        }
                        ,
                        {
                            type : 'day',
                            count : 1,
                            text : '1D'
                        },
                        // {
                        //     type : 'day',
                        //     count : 2,
                        //     text : '2D'
                        // },
                        {
                            type : 'all',
                            count : 1,
                            text : 'All',

                        }
                    ],
                    selected : 3,
                    inputEnabled : false
                },
                exporting: {
                    enabled: true,
                    filename: this.expFileName
                },
                
                scrollbar : {enabled : false},
                series : 
                [
                    {
                        yAxis: this.Y_numAxis_A,
                        name : seriesLabel.leg_serieX,
                        type: seriesType[0], //Load chart type - line,area,...
                        data: seriesOptions[0], //Array dati primo
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: seriesLabel.y_axis_a_scala
                        },
                        fillOpacity: 0.7,
                        threshold: 0,
                        turboThreshold: 0,
                        color: seriesColor[0],
                        shadow: true
                    },
                    {
                        
                        yAxis: this.Y_numAxis_B,
                        name : seriesLabel.leg_serieY,
                        type: seriesType[1], //Load chart type - line,area,...
                        data: seriesOptions[1], //Array dati secondo
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: seriesLabel.y_axis_b_scala
                        },
                        fillOpacity: 0.5,
                        threshold: 0,
                        turboThreshold:0,
                        color: seriesColor[1],
                        shadow: true
                    }
                ]
        });
    //seting MCR plotline if is MRTG
    if (seriesName[0]=='download')
    {
        var chart = $(div).highcharts();
        var attr =
        {
			id: 'mcrData',
			value: this.mcrData,
			width: 1,
			color: 'red',
			dashStyle: 'dash',
			label: {
				text: 'MCR ('+this.mcrData+' Kbps)',
				}
        }
        chart.yAxis[0].addPlotLine(attr);
    }
    
    // hide series line after drawing    
    for (i=0; i < this.hideSeries.length; i++)
    {
        $(div).highcharts().series[this.hideSeries[i]].hide();    
    }
    
    
}

//--- CREAZIONE GRAFICO MOBILE ---//
drawChart.prototype.mobileChart = function(div, divNav, seriesOptions,  seriesLabel, seriesColor, seriesType)
{
    this.Highcharts_setOptions(seriesName);
    scaleColor = this.Highcharts_setOptions(seriesName);
    
    //Modifica Select navbar
    $(divNav).find("#option1").val("25");
    $(divNav).find("#option1").html("Giornaliero");
    $(divNav).find("#option2").val("169");
    $(divNav).find("#option2").html("Settimanale");
    
    $(div).highcharts('StockChart', 
        {
            chart:
            {
                backgroundColor: 'rgba(255,255,255,.1)'
            },
            credits: {
                 enabled: false
            },
            legend: 
                {
                    enabled: true,
                    backgroundColor: '#FCFFD5',
                    borderWidth: 0.5,
                    borderColor: 'black',
                    verticalAlign: 'bottom',
                    align: 'center',
                    shadow: true
                },
                plotOptions: 
                {
                    series: 
                    {
                        animation: 
                        {
                            duration: 2000,
                            easing: 'swing'
                        },
                        turboThreshold:0,
                        threshold: 0,
                        gapSize: null   
                    }

                },
                //title: { text: seriesLabel.titolo },
                subtitle: {text: seriesLabel.sottotitolo},
                xAxis: 
                {
                    gapGridLineWidth: null,
                    title:
                    {
                        text: '<i>'+seriesLabel.x_axis+'</i>',
                        style: {color: 'black'}
                    }
                },
                yAxis:
                [
                        { // asseY_a
                                title: 
                                {
                                    text: seriesLabel.y_axis_a ,
                                    style: {color: seriesColor[0]}
                                },
                                labels: 
                                {
                                    format: '{value} ',
                                    style: {color: scaleColor[0]}
                                },
                                min: this.Y_minRange_A,
                                max: this.Y_maxRange_A,
                                lineColor: 'black',
                                lineWidth: 2,
                                opposite:false

                        },
                        { // asseY_b
                                title: 
                                {
                                    text: seriesLabel.y_axis_b,
                                    style: {color: seriesColor[1]}
                                },
                                labels: 
                                {
                                    format: '{value}',
                                    style: {color: scaleColor[1]}
                                },
                                min: this.Y_minRange_B,
                                max: this.Y_maxRange_B,
                                lineColor: 'black',
                                lineWidth: 2,
                                opposite: true
                        }
                ],

                rangeSelector : 
                {
                    buttons : 
                    [
                        {
                            type : 'hour',
                            count : 3,
                            text : '3h'
                        }, 
                        {
                            type : 'hour',
                            count : 6,
                            text : '6h'
                        } ,
                        {
                            type : 'hour',
                            count : 12,
                            text : '12h'
                        },
                        {
                            type : 'hour',
                            count : 24,
                            text : '24h'
                        }
                        // {
                        //     type : 'all',
                        //     count : 1,
                        //     text : 'All',

                        // }
                        /*,{
                            type : 'day',
                            count : 1,
                            text : '1D'
                        },
                        {
                            type : 'day',
                            count : 2,
                            text : '2D'
                        },
                        {
                            type : 'day',
                            count : 7,
                            text : '1W'
                        }*/
                    ],
                    selected : 0,
                    inputEnabled : false
                },
                navigator : {enabled : false },
                scrollbar : {enabled : false },
                series : 
                [
                    {
                        yAxis: this.Y_numAxis_A,
                        name : seriesLabel.leg_serieX,
                        type: seriesType[0], //Load chart type - line,area,...
                        data: seriesOptions[0], //Array dati primo
                        gapSize: null,
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: seriesLabel.y_axis_a_scala
                        },
                        fillOpacity: 0.7,
                        threshold: 0,
                        turboThreshold: 0,
                        color: seriesColor[0],
                        shadow: true
                    },
                    {
                         yAxis: this.Y_numAxis_B,
                        name : seriesLabel.leg_serieY,
                        type: seriesType[1], //Load chart type - line,area,...
                        data: seriesOptions[1], //Array dati secondo
                        gapSize: null,
                        tooltip: {
                            valueDecimals: 2,
                            valueSuffix: seriesLabel.y_axis_b_scala
                        },
                        fillOpacity: 0.5,
                        threshold: 0,
                        turboThreshold: 0,
                        color: seriesColor[1],
                        shadow: true
                    }
                ]
        });
    
//setting MCR plotline if is MRTG
//    if (seriesName[0]=='download')
//    {
//        var chart = $(div).highcharts();
//        var attr =
//        {
//			id: 'mcrData',
//			value: this.mcrData,
//			width: 1,
//			color: 'red',
//			dashStyle: 'dash',
//			label:
//            {
//				text: 'MCR ('+this.mcrData+' Kbps)',
//			}
//        }
//        chart.yAxis[0].addPlotLine(attr);
//    }
    
    // hide series line after drawing
    for (i=0; i < this.hideSeries.length; i++)
    {
        $(div).highcharts().series[this.hideSeries[i]].hide();    
    }

}


drawChart.prototype.errorExit = function (div,divPrinc,err)
{
    switch(err)
    {
        case 'srv_offline':
            msg = "<h4 style='text-align:center'>Server offline, plese refresh the page/chart.</h4>;"
            break;
        case 'no_data':
            msg = "<h4 style='text-align:center'>Dati non presenti - Router non raggiungibile.<h4>";
            break;
        case 'lang':
            msg = "<h4 style='text-align:center'>Error get languages.</h4>";
            break;
         default:
            msg = "<h4 style='text-align:center'>Bad connection, plese refresh the page/chart.</h4>"
    }
    
    $(div).remove();
    var div = div.replace('#','');
    
    var d = document.createElement('div');
    $(d).attr('id',div);
    $(d).appendTo($(divPrinc));
    $(d).html(msg);
    
    return false;
}

