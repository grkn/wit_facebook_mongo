const http = require('http')
const Bot = require('messenger-bot')
var Client = require('node-rest-client').Client;

var client = new Client();


'use strict'
var facebookclass= class FacebookBotClass {

	constructor(pageId, appId, appSecret, pageToken, verifyToken, globals, instanceMongoQueries) {
		 this.bot  = new Bot({
								  token : pageToken,
								  verify : verifyToken,
								  app_secret : appSecret
								});
			this.pageId = pageId;
			this.token = pageToken;
			this.global = globals;
			this.instanceMongoQueries = instanceMongoQueries;
  }

	botListen(){

		this.setWhitelist( ["http://www.hizliyol.com/"]);

		this.bot.on('error', (err) => {
		  console.log(err.message)
		})

		this.bot.on('message', (payload, reply) => {
			console.log(payload.message.text);
			this.instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "USER", text: payload.message.text}, function(resp){});

/*    var dialog = {
				data : {
									"contexts": ["shop"],
							  	"lang": "en",
							  	"query": payload.message.text,
							  	"sessionId": "12345",
							  	"timezone": "Asia/Istanbul"
							 },
				headers : {
									"Authorization" : "Bearer 327778ba5583490284a126400602a3b0",
									"Content-Type": "application/json"
								}
			}
			client.post("https://api.dialogflow.com/v1/query?v=20183001",dialog,function(response){
				let text = response.result.fulfillment.speech;
				console.log(text);
				reply({text}, function(err){
						console.log(err);
				});
			});*/

			var wit = {
				data : {
					parameters : {}
				},
				headers : { // Ozdilek intentleri
					"Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
					"Content-Type": "application/json"
				}
			};

			var globals = this.global;
			var listTemplateFunc = this.listtemplate;
			var carouselTemplateFunc = this.carousel;
			var quickReplyFunc = this.quickReply;
			var buttonGenericsFunc = this.buttonGenerics;
			var attachmentAnyFunc = this.attachmentAny;
			var locationFunc = this.location;
			var instanceMongoQueries = this.instanceMongoQueries;
			var botInstance = this.bot;

			if(payload.message.text.indexOf("hizliyol") >= 0){
				var location = "Please choose your location";
				instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": location}, function(resp){});
				botInstance.sendMessage(payload.sender.id, locationFunc(location), function(resp){
					console.log(resp);
				});
				return;
			}

			client.get("https://api.wit.ai/message?q="+encodeURIComponent(payload.message.text), wit, function(response){

				if(response.entities && response.entities.intent && response.entities.intent.length > 0 ){
					var confidence = -1;
		      var maxValue = "";

		      for(var i = 0; i < response.entities.intent.length; i++){
		        if(confidence < response.entities.intent[i].confidence ){
		          maxValue = response.entities.intent[i].value;
		          confidence = response.entities.intent[i].confidence;
		        }
		    }
				if(maxValue == "Daily-Meşgul"){
						let carousel = {elements :
														[
																	{	title : 'AAA',
																		image_url : 'http://www.hizliyol.com/images/logo.png',
																		subtitle : 'aa',
																		default_action : {type : 'web_url', url : 'http://www.hizliyol.com/images'},
																		buttons : [{type : 'phone_number', title : 'Telefon', payload : '905370277116'},
																							 {type : 'postback', title : 'Button1', payload : 'Dev Payload'},
																							 {type : 'postback', title : 'Button2', payload : 'Dev Payload'}
																							]
																	}
																 ,{ title : 'BBB',
																		image_url : 'http://www.hizliyol.com/images/logo.png',
																		subtitle : 'bbb',
																		default_action : {type : 'web_url', url : 'http://www.hizliyol.com'},
																		buttons : [{type : 'postback', title : 'Button', payload : 'Dev Payload'},
																							 {type : 'postback', title : 'Button', payload : 'Dev Payload'}
																							]
																	}
																 ,{ title : 'CCC',
																		image_url : 'http://www.hizliyol.com/images/logo.png',
																		subtitle : 'ccc',
																		default_action : {type : 'web_url', url : 'http://www.hizliyol.com'},
																		buttons : [{type : 'postback', title : 'Button', payload : 'Dev Payload'},
																							 {type : 'postback', title : 'Button', payload : 'Dev Payload'}
																							]
																	}
														 ]
						};
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": carousel}, function(resp){});
						botInstance.sendMessage(payload.sender.id, carouselTemplateFunc(carousel), function(resp){
							console.log(resp);
						});
					}else if(maxValue == "Daily-Kötüsün"){
						let quick_replies = {title : 'Here is a quick reply options',
																	quickReplyButtons : [
																		{contentType : 'text', title : 'AAA', payload : 'payload', image_url : 'http://www.hizliyol.com/images/logo.png'},
																		{contentType : 'location'},
																		{contentType : 'text', title : 'BBB', payload : 'payload'}
																	]
						};
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": quick_replies}, function(resp){});
						botInstance.sendMessage(payload.sender.id, quickReplyFunc(quick_replies), function(resp){
							console.log(resp);
						});
					}else if(maxValue == "Daily-Sistem"){
						let buttonGen = {elements : [
																	{title : 'Please choose between options',
																	 buttons : [
																	 {type : 'postback' , title : 'AAAA', payload : 'aaa'},
																	 {type : 'postback' , title : 'BBBBB', payload : 'bbb'},
																   {type : 'phone_number' , title : 'Telefon', payload : 'phonenumber'}
																 	]}]
						};
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": buttonGen}, function(resp){});
						botInstance.sendMessage(payload.sender.id, buttonGenericsFunc(buttonGen), function(resp){
							console.log(resp);
						});
					}else	if(maxValue == "Daily-Kimsin"){
						let listview = {elements :
															[
																	{
																		"title" : "Classic T-Shirt Collection",
																		"subtitle" : "See all our colors",
																		"image_url" : "http://www.hizliyol.com/images/logo.png",
																		"buttons" : [
																			{
																				"type" : "postback",
																				"title" : "Start Something",
																				"payload" : "DEVELOPER_DEFINED_PAYLOAD"
																			}
																		]
																	},
																	{
																		"title" : "Classic White T-Shirt",
																		"subtitle" : "See all our colors",
																		"default_action" : {
																			"type" : "web_url",
																			"url" : "http://www.hizliyol.com/images",
																		}
																	},
																	{
																		"title" : "Classic Blue T-Shirt",
																		"subtitle" : "100% Cotton, 200% Comfortable",
																		"image_url" : "http://www.hizliyol.com/images/logo.png",
																		"buttons" : [
																			{
																				"type" : "web_url",
																				"url" : "https://www.hizliyol.com/images",
																				"title" : "Web View",
																				"webview_height_ratio" : "full",
																				"messenger_extensions" : true,
																				"fallback_url" : "https://www.hizliyol.com/images"
																				}
																		]
																	}
														 ],
														 buttons : [
																 {
																	 "title" : "View More",
																	 "type" : "postback",
																		"payload" : "payload"
																}
														 ]
						};
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": listview}, function(resp){});
						botInstance.sendMessage(payload.sender.id, listTemplateFunc(listview), function(resp){
							console.log(resp);
						});
					}else if(maxValue == "Daily-Akıllısın"){//Kaldırmış olabilir misin? yok attachment yok da
						var attachment = {url :"http://www.hizliyol.com/images/logo.png", type :"image"};
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": attachment}, function(resp){});
						botInstance.sendMessage(payload.sender.id, attachmentAnyFunc(attachment.url, attachment.type), function(resp){
							console.log(resp);
						});
					}else if(maxValue == "Daily-Para"){
						var location = "Please choose location";
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": location}, function(resp){});
						botInstance.sendMessage(payload.sender.id, locationFunc(location), function(resp){
							console.log(resp);
						});
					}else {
						var random = Math.floor(Math.random() * (globals.responseList.length - 1));
						var text = globals.responseList[random];
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": text}, function(resp){});
						reply({text}, function(err){
						 		 console.log(err);
						});
						return;
					}
/*
					if(maxValue == "Intent-persistentMenu"){
						this.bot.setPersistentMenu ([
									{
										"title" : "Pay Bill",
										"type" : "postback",
										"payload" : "PAYBILL_PAYLOAD"
									},
									{
										"type" : "web_url",
										"title" : "Latest News",
										"url" : "https://www.messenger.com/",
										"webview_height_ratio" : "full"
									}
								], function(dt){
							console.log(dt);
						});
					}*/

				}else{
					var random = Math.floor(Math.random() * (globals.responseList.length - 1));
					var text = globals.responseList[random];
						instanceMongoQueries.insertOne("messages", {createdDate : new Date(), type : "BOT", "text": text}, function(resp){});
					  reply({text}, function(err){
					 		 console.log(err);
					  });
					  return;
				}
			});
		})
		http.createServer(this.bot.middleware()).listen(8080)
	}

	setWhitelist(url){
		var args = {
			data : {
			 	"setting_type" : "domain_whitelisting",
				"whitelisted_domains" : url,
				"domain_action_type": "add"
			},
		  headers : { "Content-Type" : "application/json" }
		};
		client.post("https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + this.token, args, function(resp){});
	}

	imagevideo(obj){
		return {
			"attachment" : {
				"type" : "image",
				"payload" : {
					"is_reusable" : true,
					"url" : obj.url
				}
			}
		};
	}

	location(loc){
		return {
		    "text" : loc,
		    "quick_replies" :[
		      {
		        "content_type" : "location"
		      }
		   ]
		};
	}

	attachmentAny(url, type){
		return {
			"attachment" : {
	      "type" : type,
	      "payload" : {
	        "url" : url,
	        "is_reusable" : true
	      }
	    }
		};
	}

	quickReply(obj){
		var quickReplyArray = [];
		for(var i = 0; i < obj.quickReplyButtons.length; i++){
				var mainObject = {content_type : obj.quickReplyButtons[i].contentType};
				if(obj.quickReplyButtons[i].title){
					mainObject['title'] = obj.quickReplyButtons[i].title;
				}
				if(obj.quickReplyButtons[i].payload){
					mainObject['payload'] = obj.quickReplyButtons[i].payload;
				}
				if(obj.quickReplyButtons[i].image_url){
					mainObject['image_url'] = obj.quickReplyButtons[i].image_url;
				}
				quickReplyArray.push(mainObject);
		}
		return {
			    "text" : obj.title,
			    "quick_replies" : quickReplyArray
	  };
	}

	buttonGenerics(obj){
		var elements = [];
		for(var i = 0; i < obj.elements.length; i++){
			var mainObject = {title : obj.elements[i].title};
			var buttons = [];
			for(var j = 0; j < obj.elements[i].buttons.length; j++){
				var button = {
					"type" : obj.elements[i].buttons[j].type,
				};
				button["title"]  = obj.elements[i].buttons[j].title;
				if(obj.elements[i].buttons[j].type =="web_url"){
					button["url"] = obj.elements[i].buttons[j].url;
					button["webview_height_ratio"] = "full";
					button["messenger_extensions"] =  true;
					button["fallback_url"] =  obj.elements[i].buttons[j].url;
				}else{
					button["payload"] =  obj.elements[i].buttons[j].payload;
				}
				buttons.push(button);
			}
			mainObject['buttons'] = buttons;
			elements.push(mainObject);
		}
		return {
			"attachment" : {
				"type" : "template",
				"payload" : {
					"template_type" : "generic",
					"elements" : elements
				}
			}
		};
	}

	carousel(obj){
		let elements = [];
		for(var i = 0; i< obj.elements.length; i++){
			var mainObject = {
				"title" : obj.elements[i].title,
				"image_url" : obj.elements[i].image_url,
				"subtitle" : obj.elements[i].subtitle,
				"default_action" : {
					"type" : obj.elements[i].default_action.type,
					"url" : obj.elements[i].default_action.url,
					"messenger_extensions" : false,
					"webview_height_ratio" : "tall"
				}
			};
			var buttons = [];
			for(var j = 0; j < obj.elements[i].buttons.length; j++){
				var button = {
					"type" : obj.elements[i].buttons[j].type,
				};
				button["title"]  = obj.elements[i].buttons[j].title;
				if(obj.elements[i].buttons[j].type == "web_url"){
					button["url"] = obj.elements[i].buttons[j].url;
					button["webview_height_ratio"] = "full";
					button["messenger_extensions"] =  true;
					button["fallback_url"] =  obj.elements[i].buttons[j].url;
				}else{
					button["payload"] =  obj.elements[i].buttons[j].payload;
				}
				buttons.push(button);
			}
			mainObject["buttons"] = buttons;
			elements.push(mainObject);
		}
		return {
			"attachment" : {
				"type" : "template",
				"payload" : {
					"template_type" : "generic",
					"elements" : elements
				}
			}
		};
	}

	listtemplate(obj){
		let elements = [];
		let mainbutton = [];
		for(var j = 0; j < obj.buttons.length; j++){
			mainbutton.push({
				"type" : obj.buttons[j].type,
				"title" : obj.buttons[j].title,
				"payload": obj.buttons[j].payload
			});
		}
		for(var i = 0; i< obj.elements.length; i++){
			var mainObject = {
				"title" : obj.elements[i].title,
				"subtitle" : obj.elements[i].subtitle,
			};
			if(obj.elements[i].image_url){
				mainObject['image_url'] = obj.elements[i].image_url;
			}
			if(obj.elements[i].default_action){
				var default_action = {
						"type" : obj.elements[i].default_action.type,
						"url" : obj.elements[i].default_action.url,
						"messenger_extensions" : false,
						"webview_height_ratio" : "tall"
					};
					mainObject["default_action"] = default_action;
			}
			if(obj.elements[i].buttons){
				var buttons = [];
				for(var j = 0; j < obj.elements[i].buttons.length; j++){
					var buttonsObject = {
						"type" : obj.elements[i].buttons[j].type,
						"title" : obj.elements[i].buttons[j].title
					}
					if(obj.elements[i].buttons[j].payload){
						buttonsObject['payload'] = obj.elements[i].buttons[j].payload;
					}
					if(obj.elements[i].buttons[j].url){
						buttonsObject['url'] = obj.elements[i].buttons[j].url;
					}
					if(obj.elements[i].buttons[j].webview_height_ratio){
						buttonsObject['webview_height_ratio'] = obj.elements[i].buttons[j].webview_height_ratio;
					}
					if(obj.elements[i].buttons[j].messenger_extensions){
						buttonsObject['messenger_extensions'] = obj.elements[i].buttons[j].messenger_extensions;
					}
					if(obj.elements[i].buttons[j].fallback_url){
						buttonsObject['fallback_url'] = obj.elements[i].buttons[j].fallback_url;
					}
					buttons.push(buttonsObject);
				}
				mainObject["buttons"] = buttons;
			}
			elements.push(mainObject);
		}
		return {
			"attachment" : {
				"type" : "template",
				"payload" : {
					"template_type" : "list",
					"top_element_style" : "compact",
					"elements" : elements,
					"buttons" : mainbutton
				}
			}
		};
	}

};

module.exports = facebookclass;
