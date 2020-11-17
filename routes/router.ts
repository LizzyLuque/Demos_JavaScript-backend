import { Router, Request, Response } from 'express';
import ArticlesController from '../controllers/article-controller';
import ChartController from '../controllers/chart-controller';
import MapController  from '../controllers/map-controller';
import AuthController from '../controllers/auth-controller';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import ChatController from '../controllers/chat-controller';
import ColasController from '../controllers/colas.controller';
import ImageController from '../controllers/image-controller';

const router = Router();

//Chat
const chat = new ChatController();

// gráficas
const charts = new ChartController();

// mapas
const mapa =  new MapController();

// Colas
const colas = new ColasController();

//CRUD
const article = new ArticlesController();
var multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/articles' });

//CRUD images
const image = new ImageController();

//Login
const auth = new AuthController();

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Rutas MAPAS /////////////////

// Api REST para los marcadores existentes
router.get('/mapa', (req: Request, res: Response) => {mapa.getMapa(req,res)});

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
////////////  Rutas GRAFICAS ////////////////

// Api REST para obtener los valores de la gráfica 
router.get('/valores/:chart', (req: Request, res: Response) => {charts.getValores(req,res)});

// Api REST para actualizar los valores de la gráfica de barras
router.post('/updateBarChart', (req: Request, res: Response) => {charts.postUpdateBarChart(req,res)});

// Api REST para actualizar los valores de la gráfica de linea
router.post('/update', (req: Request, res: Response) => {charts.postUpdate(req,res)});


/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Rutas CHAT //////////////////

// Api REST mensajes (PING)
router.get('/mensajes', (req: Request, res: Response) => {chat.getMensajes(req,res)});

// Api REST para obtener los ids de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {chat.getUsuarios(req,res)});

// Api REST para obtener los usuarios conectados
router.get('/usuarios-detalle', (req: Request, res: Response) => {chat.getUsuariosDetalle(req,res)});

// Api REST para enviar mensajes globales
router.post('/mensajes', (req: Request, res: Response) => {chat.postMensajes(req,res)});

// Api REST para enviar mensajes privados
router.post('/mensajes/:id', (req: Request, res: Response) => {chat.postMensajePrivado(req,res)});


/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Routas CRUD /////////////////

//API para guardar un artículo 
router.post('/save',  (req: Request, res: Response) => { article.save(req, res) });

//API para obtener los artículos de la base de datos | los ultimos 5 si el paramétro las está poblado
router.get('/articles/:last?',authenticateJWT, (req: Request, res: Response) => { article.getArticles(req, res) });

//API para obtener el artículo con _id igual al parámetro id
router.get('/article/:id',authenticateJWT, (req: Request, res: Response) => { article.getArticle(req, res) });

//API para actualizar el artículo con _id igual al parámetro id
router.put('/article/:id', (req: Request, res: Response) => { article.update(req, res) });

//API para borrar el artículo con _id igual al parámetro id
router.delete('/article/:id',authenticateJWT, (req: Request, res: Response) => { article.delete(req, res) });

//API para retornar la imagen con nombre igual al parámetro image
router.get('/get-image/:image', (req: Request, res: Response) => { image.getImage(req, res) });

//API para subir una imagen al servidor y asociarla al artículo con _id igual al parámetro id
router.post('/upload-image/:id', md_upload, (req: Request, res: Response) => { image.upload(req, res) });

//API para borrar una imagen del servidor utilizando el parámetro image como nombre del fichero
router.delete('/delete-image/:image', (req: Request, res: Response) => { image.deleteImage(req, res) });


/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////// INICIO RUTAS COLAS //////////////

// Api REST generar y encolar ticket
router.post('/ticket', (req: Request, res: Response) => {colas.postTicket(req, res)});

// Api REST para solicitar ticket a atender
router.post('/ticket-en-turno', (req: Request, res: Response) => {colas.postTicketEnTurno(req,res)});


/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////  Routas LOGIN  ////////////////

// API para iniciar sesión
router.post('/login', (req: Request, res: Response) => { auth.login(req, res) });

//API para registrarse e iniciar sesión
router.post('/register', (req: Request, res: Response) => { auth.register(req, res) });



export default router;