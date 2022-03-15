const express=require('express');
const app=express();
const fs=require('fs');
const body_parser=require('body-parser');
const multer  = require('multer');
const sha384 = require('js-sha512').sha384

app.use(body_parser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static('paginas'));


//Webs asociadas
app.get('/',function(req,res){
res.sendFile(__dirname+'/inicio.html')   
})
app.get('/aceptacion1',function(req,res){
})
app.get('/aceptacion2',function(req,res){
})
app.get('/incorrecto1',function(req,res){
})
app.get('/incorrecto2',function(req,res){
})
app.get('/residente',function(req,res){
res.sendFile(__dirname+'/residente.html')   
})
app.get('/inspector',function(req,res){
res.sendFile(__dirname+'/inspector.html')   
})
app.get('/verificador1',function(req,res){
})
app.get('/impresion1',function(req,res){
})
app.get('/verificador2',function(req,res){
})
app.get('/impresion2',function(req,res){
})
app.get('/libro1',function(req,res){
})
app.get('/libro2',function(req,res){
})
app.get('/cuaderno',function(req,res){
res.sendFile(__dirname+'/paginas/lista.json')
})
//Webs asociadas




//RESIDENTE

//Registro
app.post('/verificador1',function(req,res){
var usuario = req.body.usuario2 
var contraseña = req.body.contraseña2 
var confirmacion = req.body.confirmacion 
var residente = JSON.parse(fs.readFileSync('usuario/residente.json'));

if(usuario==""||contraseña==""||confirmacion==""){
res.sendFile(__dirname+'/incorrecto2.html')    
}
if(residente.d12=="" && contraseña!=confirmacion){
res.sendFile(__dirname+'/incorrecto2.html')    
}
if(residente.d12!="" && residente.d12!=confirmacion){
res.sendFile(__dirname+'/incorrecto2.html')    
}
if(residente.d12=="" && contraseña!="" && contraseña==confirmacion ){
res.sendFile(__dirname+'/aceptacion1.html')
fs.writeFileSync('usuario/residente.json', '{"d11":"'+usuario+'","d12":"'+contraseña+'"}')
}
if(residente.d12!="" && residente.d12==confirmacion){
res.sendFile(__dirname+'/aceptacion1.html')
fs.writeFileSync('usuario/residente.json', '{"d11":"'+usuario+'","d12":"'+contraseña+'"}')
}})

//Validacion de usuario
var bandera=0;
app.post('/impresion1',function(req,res){
var usuario = req.body.usuario 
var contraseña = req.body.contraseña 
var residente = JSON.parse(fs.readFileSync('usuario/residente.json'));
if(residente.d11==usuario && residente.d12==contraseña){
res.sendFile(__dirname+'/aceptacion2.html')
bandera=1
}else{
res.sendFile(__dirname+'/incorrecto2.html')
bandera=0}
})

//Almacenamiento de archivo
const subida_residente = multer({
dest:'paginas/residente_espera'}) 


app.post('/libro1',subida_residente.single('oculto'),function(req,res){
var residente = JSON.parse(fs.readFileSync('usuario/residente.json'));
var inspector = JSON.parse(fs.readFileSync('usuario/inspector.json'));
var codigoi = JSON.parse(fs.readFileSync('usuario/hash_inspector.json'));
var num=0;
var P =[];
var aux=String(fs.readdirSync('paginas/residente_espera','utf-8'))
if(bandera==1){  
var fecha=new Date(Date.now())
fecha=fecha.toLocaleDateString()+'- '+fecha.toTimeString()    
var A = JSON.parse(fs.readFileSync('paginas/lista.json'));
for(var i=0;i<A.length;i++){P.push(A[i])}     
var aux2=fs.readFileSync('paginas/residente_espera/'+aux,'utf-8')
fs.writeFileSync('usuario/hash_residente.json','{"h1":"'+sha384(aux2)+'"}')
num=(fs.readdirSync('paginas/impresas','utf-8').length)+1
fs.renameSync('paginas/residente_espera/'+aux,'paginas/impresas/pagina'+num+'.pdf')
if(num==1){var recibo=sha384(String(Math.random()))
}else{
recibo=sha384(residente.d11+residente.d12+inspector.d21+inspector.d22+sha384(aux)+recibo)}
if(codigoi.h1!==sha384(aux2)){
fs.unlinkSync('paginas/impresas/pagina'+num+'.pdf')
res.sendFile(__dirname+'/espera1.html')
}else{
res.sendFile(__dirname+'/aceptacion3.html')
P.push(fecha ) 
P.push(recibo) 
P.push(sha384(aux2)) 
P=JSON.stringify(P)
fs.writeFile("paginas/lista.json", P, 'utf8', function (err) {
    if (err){ 
    console.log("Error al escribir el archivo");
    return console.log(err);
    }
    console.log("El archivo ha sido escrito")})
}
bandera=0
}else{
fs.unlinkSync('paginas/residente_espera/'+aux)
res.sendFile(__dirname+'/incorrecto2.html')
}

})

//RESIDENTE    



//INSPECTOR

//Registro
app.post('/verificador2',function(req,res){
var usuario = req.body.usuario2 
var contraseña = req.body.contraseña2 
var confirmacion = req.body.confirmacion 
var inspector = JSON.parse(fs.readFileSync('usuario/inspector.json'));

if(usuario==""||contraseña==""||confirmacion==""){
res.sendFile(__dirname+'/incorrecto3.html') 
}
if(inspector.d21=="" && contraseña!=confirmacion){
res.sendFile(__dirname+'/incorrecto3.html') 
}
if(inspector.d21!="" && inspector.d22!=confirmacion){
res.sendFile(__dirname+'/incorrecto3.html') 
}
if(inspector.d21=="" && contraseña==confirmacion){
res.sendFile(__dirname+'/aceptacion4.html')
fs.writeFileSync('usuario/inspector.json', '{"d21":"'+usuario+'","d22":"'+contraseña+'"}')
}
if(inspector.d21!="" && inspector.d22==confirmacion){
res.sendFile(__dirname+'/aceptacion4.html')
fs.writeFileSync('usuario/inspector.json', '{"d21":"'+usuario+'","d22":"'+contraseña+'"}')
}})
    
//Validacion de usuario
var bandera2=0;
app.post('/impresion2',function(req,res){
var usuario = req.body.usuario 
var contraseña = req.body.contraseña 
var inspector = JSON.parse(fs.readFileSync('usuario/inspector.json'));
if(inspector.d21==usuario && inspector.d22==contraseña){
res.sendFile(__dirname+'/aceptacion5.html')
bandera2=1
}else{
bandera2=0;    
res.sendFile(__dirname+'/incorrecto4.html')}
})
    
//Almacenamiento de archivo
const subida_inspector = multer({
dest:'paginas/inspector_espera'}) 
    
    
app.post('/libro2',subida_inspector.single('oculto'),function(req,res){
var residente = JSON.parse(fs.readFileSync('usuario/residente.json'));
var inspector = JSON.parse(fs.readFileSync('usuario/inspector.json'));
var codigor = JSON.parse(fs.readFileSync('usuario/hash_residente.json'));
var num=0;
var P =[];
var aux=String(fs.readdirSync('paginas/inspector_espera','utf-8'))
if(bandera2==1){ 
var fecha=new Date(Date.now())
fecha=fecha.toLocaleDateString()+'- '+fecha.toTimeString()      
var A = JSON.parse(fs.readFileSync('paginas/lista.json'));
for(var i=0;i<A.length;i++){P.push(A[i])}    
var aux2=fs.readFileSync('paginas/inspector_espera/'+aux,'utf-8')
fs.writeFileSync('usuario/hash_inspector.json','{"h1":"'+sha384(aux2)+'"}')
num=(fs.readdirSync('paginas/impresas','utf-8').length)+1
fs.renameSync('paginas/inspector_espera/'+aux,'paginas/impresas/pagina'+num+'.pdf')
if(num==1){var recibo=sha384(String(Math.random()))
}else{
recibo=sha384(residente.d11+residente.d12+inspector.d21+inspector.d22+sha384(aux2)+recibo)}
if(codigor.h1!==sha384(aux2)){
fs.unlinkSync('paginas/impresas/pagina'+num+'.pdf')
res.sendFile(__dirname+'/espera2.html')
}else{
res.sendFile(__dirname+'/aceptacion6.html')
P.push(fecha ) 
P.push(recibo) 
P.push(sha384(aux2)) 
P=JSON.stringify(P)
fs.writeFile("paginas/lista.json", P, 'utf8', function (err) {
    if (err){ 
    console.log("Error al escribir el archivo");
    return console.log(err);
    }
    console.log("El archivo ha sido escrito")})
}
bandera2=0
}else{
fs.unlinkSync('paginas/inspector_espera/'+aux)
res.sendFile(__dirname+'/incorrecto4.html')  
}
})

app.listen(8000,()=>{
console.log('server on port  8000');
})