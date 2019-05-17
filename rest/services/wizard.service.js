(function () {
    'use strict';

    app.factory('WizardService', WizardService);

    WizardService.$inject = ['WizardHandler','$timeout'];
    function WizardService($WizardHandler,$timeout) {
        var service = {};

        service.setProgressLine = setProgressLine;
        service.backwardStep = backwardStep;
        service.wizardContinue = wizardContinue;

        return service;

        function setProgressLine(state, forward) {
            forward = forward || false;
            
            var progessBarElement = angular.element(document.querySelector('.progress-line'));
            progessBarElement.css('background', '#19ff6a');

            var windowWidth = angular.element(document.querySelector(".steps-indicator").querySelectorAll("li"));
            for (var i = 0; i < windowWidth.length; ++i) {
                var ele = angular.element(windowWidth[i])
                ele.addClass("f1-step")
            }
            var totalWidth = 0;
            var wItem = $(".f1-step").length

           
            angular.element($('.f1-step').each(function (index) {
                totalWidth += parseInt($(this).width());
            }))

            angular.element($(".progress-line").width($(".f1-step").width() * state / 2))

            if (forward) {
                
                angular.element($(".steps-6").animate({scrollLeft: 500}))
            }
        }

        function backwardStep() {
       
            angular.element($(".steps-6").animate({scrollLeft: -500}))
        }

        function wizardContinue(stepNo,wizardDoneStepStatus){
           
            while(!wizardDoneStepStatus){
                for (var i = stepNo; i < 6; i++) { 
                  
                    var target = $('li.f1-step:eq('+i+')').removeClass('done')
                    
                   angular.element($('li.f1-step:eq('+i+')').removeClass('done'));
                    if(target != null){
                        wizardDoneStepStatus = true;
                    }
                }
            }
            
             $timeout(function(){
               
               
                    for (var i = stepNo; i < 6; i++) { 
                      
                        angular.element($('li.f1-step:eq('+i+')').removeClass('done'));
                    }  
                
            },100)

            $timeout(function(){
            switch(parseInt(stepNo)) {
                case 1:
                  
                    setProgressLine(3);
                    break;
                case 2:
                   
                    setProgressLine(5);
                    break;
                case 3:
                   
                    setProgressLine(7,true);
                    break;
                case 4:
                   
                    setProgressLine(9,true);
                    break;
                case 5:
                   
                    setProgressLine(11,true);
                    break;
            }
        },50)
        }
        
    }

})();
