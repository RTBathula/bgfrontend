app.factory('staticDataServices', function () {

    var global = {};

    
    global.getLocations = function(){      
        
        return [
            {
                formatted_address:"Hyderabad, Telangana, India",
                geometry:{
                    location:{
                        G: 17.385044,
                        K: 78.486671
                    }
                },
                name:"Hyderabad"
            },
            {
                formatted_address:"Bengaluru, Karnataka, India",
                geometry:{
                    location:{
                        G: 12.9715987,
                        K: 77.59456269999998
                    }
                },
                name:"Bengaluru"
            },
            {
                formatted_address:"Chicago, IL, USA",
                geometry:{
                    location:{
                        G: 41.8781136,
                        K: -87.62979819999998
                    }
                },
                name:"Chicago"
            },            
            {
                formatted_address:"San Francisco, CA, USA",
                geometry:{
                    location:{
                        G: 37.7749295,
                        K: -122.41941550000001
                    }
                },
                name:"San Francisco"
            }
        ];

    };

    global.getGraduationYears = function(){
        var gradYearList=[];
        var currentDate = new Date();

        //Past Years
        for(var i=5;i>=0;--i){
            var yearObj={            
              value: currentDate.getFullYear()-i,
              visible: true
            };
            gradYearList.push(yearObj); 
        }

        //Future Years
        for(var i=1;i<2;++i){
            var yearObj={            
              value: currentDate.getFullYear()+i,
              visible: true
            };
            gradYearList.push(yearObj); 
        }
        
        return gradYearList;

    };


    global.getAcademicGrades = function(){    
        
        return [
            {               
                text:"85%-92%",
                range:{
                    from:85,
                    to  :92
                },
                country:"india"
            },
            {
                text:"77%-85%",
                range:{
                    from:77,
                    to  :85
                },
                country:"india"
            },
            {
                text:"68%-77%",
                range:{
                    from:68,
                    to  :77
                },
                country:"india"
            },
            {
                text:"63%-68%",
                range:{
                    from:63,
                    to  :68
                },
                country:"india"
            }, 
            {
                text:"59%-63%",
                range:{
                    from:59,
                    to  :63
                },
                country:"india"
            }

        ];

    };

    global.getDegreeNames = function(){
        
        return [
            {
                text:"B.Tech",
                name:"B.Tech"                
            },
            {
                text:"MBA",
                name:"MBA"
            },
            {
                text:"M.Tech/MS",
                name:"M.Tech/MS"
            },
            {
                text:"B.Sc",
                name:"B.Sc"
            },
            {
                text:"B.Commerce",
                name:"B.Commerce"
            },
            {
                text:"B.A",
                name:"B.A"
            }
            
        ]
    };
 

    global.getSkillSet = function(){
        
        return [
            {
                text:"Java",
                name:"java,j2ee",
                checked:false                
            },
            {
                text:".Net",
                name:".net,c#,asp.net,ado.net,ms sql,link,vb.net",
                checked:false   
            },
            {
                text:"Javascript",
                name:"javascript,jquery,angularjs,backbonejs,nodejs",
                checked:false   
            },
            {
                text:"Node.Js",
                name:"javascript,nodejs,expressjs,hapi",
                checked:false   
            },
            {
                text:"MongoDb",
                name:"mongodb",
                checked:false   
            },
            {
                text:"PHP",
                name:"php,joomla,wordpress,zend,cupcake,codeigniter",
                checked:false   
            },
            {
                text:"Python",
                name:"python",
                checked:false   
            },
            {
                text:"Ruby",
                name:"ruby",
                checked:false   
            },
            {
                text:"SQL",
                name:"ms sql,mysql",
                checked:false   
            }                
            
        ]
    };

    global.getDesignationNames = function(){
        
        return [
            {
                text:"Software Developer",
                name:"software developer"                
            },
            {
                text:"Full Stack Developer",
                name:"full stack developer"
            },
            {
                text:"Data Scientist",
                name:"data scientist"
            },
            {
                text:"Evangelist",
                name:"evangelist"
            }            
            
        ]
    };

    global.getExperiences = function(){
        
        return [
            {
                text:"Fresher",
                range:{
                    from:0,
                    to:1
                }               
            },
            {
                text:"1-2 Years",
                range:{
                    from:1,
                    to:2
                }              
            },
            {
                text:"2-3 Years",
                range:{
                    from:2,
                    to:3
                }              
            },
            {
                text:"3-5 Years",
                range:{
                    from:3,
                    to:5
                }              
            },
            {
                text:"5-7 Years",
                range:{
                    from:5,
                    to:7
                }              
            },
            {
                text:"7-10 Years",
                range:{
                    from:7,
                    to:10
                }              
            }       
            
        ]
    };

    global.getCompanyNames = function(){
        
        return [
            {
                text:"Facebook",
                name:"facebook"                
            },
            {
                text:"Google",
                name:"google"
            },
            {
                text:"Apple",
                name:"apple"
            },
            {
                text:"Microsoft",
                name:"microsoft"
            }            
            
        ]
    };

    return global;
});
