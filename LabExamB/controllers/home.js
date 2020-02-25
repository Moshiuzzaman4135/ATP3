var express 	= require('express');
var router 		= express.Router();
var userModel   = require.main.require('./models/user-model');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/', function(req, res){	
	if(req.cookies['username'] != null){
		userModel.getByUname(req.cookies['username'], function(result){
			res.render('home/index', {user: result});
		});
	}else{
		res.redirect('/logout');
	}
});

router.get('/allemp', function(req, res){
	userModel.getAllEmp(function(results){
		if(results.length > 0){
			res.render('home/allemp', {userlist: results});
		}else{
			res.send('invalid username/password');
		}
	});
});

router.get('/create', function(req, res){
	res.render('home/create');				
	
});
router.post('/create', function(req, res){
	
	var employee = {
		name   	: req.body.name,
		companyname   	: req.body.companyname,
		contactno   	: req.body.contactno,
		username: req.body.username,
		password: req.body.password,
		
	};

	userModel.insertEmp(employee, function(status){
		if(status){
			console.log(status);
			res.redirect('/allemp');
		}else{
			res.redirect('/create');
		}
	});
})




router.get('/edit/:id', function(req, res){
	
	userModel.getById(req.params.id, function(result){
		res.render('home/edit', {user: result});
	});
})

router.post('/edit/:id', function(req, res){
	
	var user = {
		username: req.body.username,
		password: req.body.password,
		type: req.body.type,
		id: req.params.id
	};

	userModel.update(user, function(status){
		if(status){
			res.redirect('/home/alluser');
		}else{
			res.redirect('/home/edit/'+req.params.id);
		}
	});
})


router.get('/delete/:id', function(req, res){
	
	userModel.getById(req.params.id, function(result){
		res.render('home/delete', {user: result});
	});
})

router.post('/delete/:id', function(req, res){
	
	userModel.delete(req.params.id, function(status){
		if(status){
			res.redirect('/home/alluser');
		}else{
			res.redirect('/home/delete/'+req.params.id);
		}
	});
})

module.exports = router;

