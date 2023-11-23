//UZKARGO-6.02.23

//function onCreate() {
 //  EdocsApi.setAttributeValue({code: 'DocExecutionTerm', value: EdocsApi.getVacationPeriodEnd(new Date(), 30), text: null});
 //   }

function onCardInitialize() {
debugger;
    ShtrafInProcess();
    onChangeClaimKind();
    calculateTotalSum2();
    //AssignRespProcess();
    setContractorHome();
    setRozriz();
    setTopicDocument();

    DocCheckInProcess();
 if(!EdocsApi.getAttributeValue('DocExecutionTerm')?.value)
        EdocsApi.setAttributeValue({code: 'DocExecutionTerm', value: EdocsApi.getVacationPeriodEnd(new Date(), 30), text: null});
}
//Доступні таблиці на етапі маршруту
function ShtrafInProcess(){
    if(EdocsApi.getCaseTaskDataByCode('Shtraf')?.state == 'inProgress'){
        controlNotDisabled('ClaimTable');
        controlNotDisabled('ClaimTableCarrier');
    }
}

function setRozriz(){

    if(!EdocsApi.getAttributeValue('Rozriz').value){

        EdocsApi.setAttributeValue({code: 'Rozriz', value: EdocsApi.findEmployeeSubdivisionByLevelAndEmployeeID(CurrentDocument.initiatorId, 1)?.unitName.replaceAll('"', ''), text: null});

    }

}

function calculateSumaAll(){
    var DocCheck1 = EdocsApi.getCaseTaskDataByCode('DocCheck1');
    if(DocCheck1 && DocCheck1.executionState != 'complete'){
        var totalSum = EdocsApi.getAttributeValue('totalSum')?.value ?? 0;
        var PaidAmount2 = EdocsApi.getAttributeValue('PaidAmount2')?.value ?? 0;
        EdocsApi.setAttributeValue({code: 'SumaAll', value: (parseFloat(totalSum)+parseFloat(PaidAmount2)), text: null});
    }
}
function onChangetotalSum(){
    calculateSumaAll();
}
function onChangePaidAmount2(){
    calculateSumaAll();
}

function onChangeClaimKind(){
    claimKind = EdocsApi.getAttributeValue('ClaimKind');
    if(claimKind && claimKind.value == '2'){                   
        EdocsApi.setControlProperties({code: 'SaveCargoFailureType', hidden: false, disabled: false, required: true});
    }
	else{
	   EdocsApi.setControlProperties({code: 'SaveCargoFailureType', hidden: true, disabled: false, required: false});
	}
    setTopicDocument();
}

function calculateTotalSum() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTable');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'ContractAmount');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum', value: contractAmountSum > 0 ? contractAmountSum : 0});
}
function calculateTotalSum3() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTableCarrier');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'InvoiceClaimAmount3');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum3', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}
function calculateAmountCarrier() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTableCarrier');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'AmountCarrier');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'PaidAmount2', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}

function calculateTotalSum2() {
    
    var totalSum2 = EdocsApi.getAttributeValue('totalSum2')?.value;
    if(!totalSum2){
        var tableAttr = EdocsApi.getAttributeValue('Invoice_Claim_table2');
        var length = tableAttr.value ? tableAttr.value.length : 0;

        var contractAmountSum = 0;
        for (var i = 0; i < length; i++) {
            var row = tableAttr.value[i];
            var contactAmount = row.find(x => x.code == 'Invoice_Claim_Amaunt2');
            contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
        }
var val =  contractAmountSum > 0 ? contractAmountSum : 0 ;
if(val && val > 0)
        EdocsApi.setAttributeValue({ code: 'totalSum2', value: val});
    }
}
function calculateTotalSum1() {
    
    var tableAttr = EdocsApi.getAttributeValue('ClaimTable');
    var length = tableAttr.value ? tableAttr.value.length : 0;

    var contractAmountSum = 0;
    for (var i = 0; i < length; i++) {
        var row = tableAttr.value[i];
        var contactAmount = row.find(x => x.code == 'ContractAmount1');
        contractAmountSum += contactAmount && contactAmount.value ? parseFloat(contactAmount.value) : 0;
    }
    EdocsApi.setAttributeValue({ code: 'totalSum1', value: contractAmountSum > 0 ? contractAmountSum : 0 });
}
function onTaskExecuteAssignResp(routeStage){
    //AssignRespProcess();
}

function AssignRespProcess(){
    var AssignResp = EdocsApi.getCaseTaskDataByCode('AssignResp'+EdocsApi.getAttributeValue("Rozriz").value);
    if(AssignResp && AssignResp.executionState == 'inProgress'){
        controlRequired('Responsible2');
        controlNotDisabled('Responsible2');
    }
    else{
        controlNotRequired('Responsible2');
        controlDisabled('Responsible2');
    }
}

function onBeforeCardSave(){  
    setRegProp();  
    setSumProp(); 
    if(!EdocsApi.getAttributeValue('SumaAll')?.value){
        if(EdocsApi.getCaseTaskDataByCode('Shtraf')?.state == 'inProgress' || EdocsApi.getCaseTaskDataByCode('Shtraf1')?.state == 'inProgress' || EdocsApi.getCaseTaskDataByCode('Shtraf2')?.state == 'inProgress')
            throw 'Не вірно введенні дані. Перевірте введену Задоволену суму по Таблицям';
    }
    if(!EdocsApi.getAttributeValue('DocExecutionTerm')?.value)
        EdocsApi.setAttributeValue({code: 'DocExecutionTerm', value: EdocsApi.getVacationPeriodEnd(new Date(), 30), text: null});

    if(EdocsApi.getAttributeValue('ContractorEDRPOU').value != EdocsApi.getAttributeValue('ContractorEDRPOUText').value){
        EdocsApi.setAttributeValue({code: 'ContractorEDRPOUText', value: EdocsApi.getAttributeValue('ContractorEDRPOU').value, text: null});
        EdocsApi.setAttributeValue({code: 'CounterpartyText', value: EdocsApi.getAttributeValue('ContractorName').value, text: null});
    }
}

function setRegProp(){
    var RegNumber = EdocsApi.getAttributeValue('RegNumber').value;
    var RegDate = EdocsApi.getAttributeValue('RegDate').value;
    if(RegNumber && RegDate){
        if(EdocsApi.getAttributeValue('ClaimNumber').value != RegNumber)
            EdocsApi.setAttributeValue({code: 'ClaimNumber', value: RegNumber, text: null});
        if(EdocsApi.getAttributeValue('ClaimDate').value != moment(RegDate).format('DD.MM.YYYY'))
            EdocsApi.setAttributeValue({code: 'ClaimDate', value: moment(RegDate).format('DD.MM.YYYY'), text: null});
    }
    else{
        EdocsApi.setAttributeValue({code: 'ClaimNumber', value: null, text: null});
        EdocsApi.setAttributeValue({code: 'ClaimDate', value: null, text: null});
    }
}
function setSumProp(){
    var totalSum2 = EdocsApi.getAttributeValue('totalSum2').value;
    if(totalSum2){
        if(EdocsApi.getAttributeValue('SatisfiedAmount').value != totalSum2)
            EdocsApi.setAttributeValue({code: 'SatisfiedAmount', value: totalSum2, text: null});
    }
    else{
        EdocsApi.setAttributeValue({code: 'SatisfiedAmount', value: null, text: null});
    }
}

function onChangeClaimTableCarrier(){
    calculateAllSums("Розподіл по причетним перевізникам");
	
}

function onChangeClaimTable(){
    calculateAllSums("Розподіл по причетним підрозділам");
}

function calculateAllSums(tablname){
 var totalSum2 = EdocsApi.getAttributeValue('totalSum2')?.value;
if(!totalSum2) {
calculateTotalSum2();
totalSum2 = EdocsApi.getAttributeValue('totalSum2')?.value;
}
    calculateTotalSum();
    calculateTotalSum1();
    calculateTotalSum3();

    calculateAmountCarrier();
    calculateSumaAll();

    var SumaAll = EdocsApi.getAttributeValue('SumaAll')?.value;
    SumaAll  = parseFloat(SumaAll ? SumaAll : 0);
   
    totalSum2 = parseFloat(totalSum2 ? totalSum2 : 0);
    if(SumaAll > totalSum2){
		EdocsApi.setAttributeValue({code: 'SumaAll', value: null, text: null});
        throw 'Не вірно введенні дані. Сума в таблиці "'+tablname+'" перевищує "Сума претензії"';
    }
    else{
        if(SumaAll == 0){
            EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Відхилено', text: null});
        }
        else{
            if(SumaAll == totalSum2){
                EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Задоволено', text: null});
            }
            else{
                EdocsApi.setAttributeValue({code: 'Processing_result', value: 'Частково задоволено', text: null});
            }
        }
    }
}

function onChangeContractAmount1(){
    var ContractAmount1 = EdocsApi.getAttributeValue('ContractAmount1');   
    EdocsApi.setAttributeValue({code: 'ContractAmount', value: ContractAmount1.value, text: ContractAmount1.text}); 
}
function onChangeInvoiceClaimAmount3(){
    var InvoiceClaimAmount3 = EdocsApi.getAttributeValue('InvoiceClaimAmount3');   
    EdocsApi.setAttributeValue({code: 'AmountCarrier', value: InvoiceClaimAmount3.value, text: InvoiceClaimAmount3.text}); 
}

function controlHide(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.hidden = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlShow(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.hidden = false;
        EdocsApi.setControlProperties(control);
    }
}

function controlRequired(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.required = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlNotRequired(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.required = false;
        EdocsApi.setControlProperties(control);
    }
}

function controlDisabled(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.disabled = true;
        EdocsApi.setControlProperties(control);
    }
}
function controlNotDisabled(CODE){
    var control = EdocsApi.getControlProperties(CODE);
    if(control){
        control.disabled = false;
        EdocsApi.setControlProperties(control);
    }
}
function setContractorHome() {
    var ContractorCode = EdocsApi.getAttributeValue("OrgCode");
    if (!CurrentDocument.isDraft || ContractorCode.value || ContractorCode.value == "40075815") {
        return;
    }
    var OrganizationID = EdocsApi.getAttributeValue("OrganizationID");
    var OrgShortName = EdocsApi.getAttributeValue("OrgShortName");
  
    OrgShortName.value = 'АТ "Укрзалізниця"';
    ContractorCode.value = "40075815";
    OrganizationID.value = '1';
   
    EdocsApi.setAttributeValue(OrgShortName);
    EdocsApi.setAttributeValue(ContractorCode);
    EdocsApi.setAttributeValue(OrganizationID);
}
//ВІдправка коментаря про створення Справи
function onTaskExecuteAccepted(routeStage){
    if(routeStage.executionResult != 'rejected'){
        if(CurrentDocument.inExtId){
            var methodData = {
                extSysDocId: CurrentDocument.id,
                extSysDocVersion:  CurrentDocument.version,
                eventType: "CommentAdded",
                comment: 'Документ "Претензійна справа" створена і зареєстрована №'+EdocsApi.getAttributeValue('RegNumber')?.value+' від '+moment(EdocsApi.getAttributeValue('RegDate')?.value).format('DD.MM.YYYY'),
                partyCode: EdocsApi.getAttributeValue('OrgCode').value,
                userTitle: CurrentUser.name,
                occuredAt: new Date()
            };
           routeStage.externalAPIExecutingParams = {externalSystemCode: 'ESIGN1', externalSystemMethod: 'integration/processEvent', data: methodData, executeAsync: false}
        }
    }
}

function onSearchClaimTableInvoice(searchRequest){
    searchChildTable(searchRequest);
}
function onSearchInvoiceCarrier(searchRequest){
    searchChildTable(searchRequest);
}
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
}

function searchChildTable(searchRequest){
    var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
    if(parentTable && parentTable.length > 0){
        /*
        var firstChildTable = EdocsApi.getAttributeValue('ClaimTable')?.value;
        var secondChildTable = EdocsApi.getAttributeValue('ClaimTableCarrier')?.value;
        childArr = [];
        if((firstChildTable && firstChildTable.length > 0) || (secondChildTable && secondChildTable.length > 0)){
            childArr = [...firstChildTable.map(x=>x.find(y=>y.code == 'ClaimTableInvoice').value), ...secondChildTable.map(x=>x.find(y=>y.code == 'InvoiceCarrier').value)];
        }
        var parentArr = parentTable.map(x=>x.find(y=>y.code == 'Invoice_Claim_number2').value)
        
        searchRequest.response = (parentArr.diff(childArr)).map(n=> ({name: n, id: n}));
        */
        var parentArr = parentTable.map(x=>x.find(y=>y.code == 'Invoice_Claim_number2').value)        
        searchRequest.response = parentArr.map(n=> ({name: n, id: n}));
    }
    else{
        searchRequest.response = null;
    }
}
function onChangeClaimTableInvoice(){

    setClaimTable('ClaimTableInvoice','ContractAmount1','ContractAmount');

    setSecondTableCallDictionary('ClaimTableInvoice','typeInvoice_Claim_table2','TypeInvoiceClaimTable');

    setSecondTableCall('ClaimTableInvoice','dataInvoice_Claim_table2','DataClaimTable');

}

function onChangeInvoiceCarrier(){

    setClaimTable('InvoiceCarrier','InvoiceClaimAmount3','AmountCarrier');

    setSecondTableCallDictionary('InvoiceCarrier','typeInvoice_Claim_table2','TypeInvoiceClaimTableCarrier');

    setSecondTableCall('InvoiceCarrier','dataInvoice_Claim_table2','DataClaimTableCarrier');

}
function setClaimTable(elName, setInvoice, setAmount){
    var el = EdocsApi.getAttributeValue(elName)?.value;
    if(el){
        var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
        var buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code=='Invoice_Claim_Amaunt2')?.value)[0];
        if(buf){
            EdocsApi.setAttributeValue({code: setInvoice, value: buf, text: null});
            EdocsApi.setAttributeValue({code: setAmount, value: buf, text: null});
        }
    }
}
//Справа  перевірка на етапі AssignResp
function onTaskExecuteAssignResp(routeStage){
    if(routeStage.executionResult != 'AssignResp'){
        var buf = false;
        var str = 'Заповніть поле(я)  ';
       
	}
  
    if(!EdocsApi.getAttributeValue('Responsible2').value){
        buf = true;
        str += '"Відповідальний претензіоніст", ';
    } 
        
    if(buf){
        throw str.slice(0, -2);
    }
}

function DocCheckInProcess(){
    if(EdocsApi.getCaseTaskDataByCode('DocCheck')?.executionState == 'inProgress'){
        controlShow('Processing_result');
    }
    else{
        controlHide('Processing_result');
    }
}

function onTaskExecutedDocCheck1(routeStage){
    if(routeStage.executionResult != 'rejected') {
        controlShow('Processing_result');
    }
}



function setSecondTableCall(elName, fromCall, toCall){
    var el = EdocsApi.getAttributeValue(elName)?.value;
    if(el){
        var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
        var buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code==fromCall)?.value)[0];
        if(buf){
            EdocsApi.setAttributeValue({code: toCall, value: buf, text: null});
        }
    }
}

function setSecondTableCallDictionary(elName, fromCall, toCall){
    var el = EdocsApi.getAttributeValue(elName)?.value;
    if(el){
        var parentTable = EdocsApi.getAttributeValue('Invoice_Claim_table2')?.value;
        var buf = parentTable.filter(x => { return x.find(y=>y.value == el)})?.map(s=>s.find(n=>n.code==fromCall))[0];
        if(buf){
            EdocsApi.setAttributeValue({code: toCall, value: buf.value, text: buf.text, itemCode: buf.itemCode, itemDictionary: buf.itemDictionary});
        }
    }
}

function onSearchInvolvedUnit(request){
    request.filterCollection.push({attributeCode:'SubdivisionLevelDirect', value:'1'});
}


//UZKARGO-140
function onChangeCostDocumentTable(){
    var CostDocumentTable = EdocsApi.getAttributeValue('CostDocumentTable').value;
    if(CostDocumentTable && CostDocumentTable.length>0){
        try{
            EdocsApi.setAttributeValue({code: 'CostSumTotal', value: CostDocumentTable.flat().filter(x=>x.code=='CostSum').map(x => Number(x.value)).reduce((sum, x) => sum + x, 0), text: null});
        }
        catch(err){
            EdocsApi.message(err.message);
        }
    }
    else{
        EdocsApi.setAttributeValue({code: 'CostSumTotal', value: null, text: null});
    }
}



/*
function onRouteStartMainTask() {
    const answer = send('1');
    if(!answer.status){
        throw answer.error;
    }
    else{console.log('Все добре! 1')}
}
*/





function onTaskExecuteRegist(routeStage) {
    if (routeStage.executionResult == 'executed') {
        const answer = send('1');
        if(!answer.status){
            throw answer.error;
        }
        else{console.log('Все добре! 1')}
    }
}

function onTaskExecutePayment(routeStage) {
    if (routeStage.executionResult == 'executed') {
        const answer = send('2');
        if(!answer.status){
            throw answer.error;
        }
        else{console.log('Все добре! 2')}
    }
}


function onTaskExecuteDocCheck(routeStage) {
    if (routeStage.executionResult == 'executed') {
        const Letter = EdocsApi.getCaseTaskDataByCode('Letter');
        if(Letter && !Letter.notIncludeInRoute){
            if(Letter.state == 'completed'){
                customTaskExecuteDone();
            }
        }
        else{
            customTaskExecuteDone();
            const answer = send('2');
            if(!answer.status){
                throw answer.error;
            }
            else{console.log('Все добре! 2')}
        }
    }
}
function onTaskExecuteLetter(routeStage) {
    if (routeStage.executionResult == 'executed') {
        const DocCheck = EdocsApi.getCaseTaskDataByCode('DocCheck');
        if(DocCheck && DocCheck.state == 'completed'){
            customTaskExecuteDone();
        }
    }
}

function customTaskExecuteDone() {
    const answer = send('3');
    if(!answer.status){
        throw answer.error;
    }
    else{console.log('Все добре! 3')}
}


function send(eventType){
    var response = EdocsApi.runExternalFunction('PKTB', 'ClaimWriteDocument', createmethodData(eventType, '11'));

    if(response && response.data == null) {   
       return {status: true, error: ''};   
    }
    else if (response.data.error) {
        if (response.data.error.validationErrors && response.data.error.validationErrors.length > 0) {
            var errorMessage = '';
            for (var i = 0; i < response.data.error.validationErrors.length; i++) {
                errorMessage += response.data.error.validationErrors[i].message + '; ';
            }
            return  {status: true, error:(response.data.error.details + "  -  " + errorMessage)};
        }
    } 
    else {
        return {status: true, error:'Не отримано відповіді від зовнішньої системи'};
    }
    
}


function createmethodData(eventType, typeDoc){
    var methodData = { 
        ExtSysId: "eDocs",
        ExtDocId: CurrentDocument.id,
        EventType: eventType,
        TypeDoc: typeDoc,
        Attributes:[]
    };
    if(eventType == '1'){
        methodData.Attributes = RegistrationAtributs();
    }
    else if(eventType == '3'){
        methodData.Attributes = FixationAtributs();
    }

    if(eventType == '2'){
        methodData.Attributes = (RegistrationAtributs().concat({code: "DateSplat", value: (EdocsApi.getAttributeValue('PaymentDate').value ? moment(EdocsApi.getAttributeValue('PaymentDate').value).format('YYYY-MM-DD') : null)})).concat(FixationAtributs());
    }
    
    return methodData;
}

function RegistrationAtributs(){
    return [
        {code: "NumDoc", value: EdocsApi.getAttributeValue('RegNumber').value},
        {code: "Applicant", value: EdocsApi.getAttributeValue('ContractorEDRPOU').value},
        {code: "Rasch", value: EdocsApi.getAttributeValue('Bill').value},
        {code: "TypeClaim", value: EdocsApi.getAttributeValue('ClaimKind').value},
        {code: "TypeConn", value: (EdocsApi.getAttributeValue('RailwayConnectionType').value == 'Внутрішнє' ? '1' : '2')},
        {code: "DatePrt", value: moment(EdocsApi.getAttributeValue('RegDate').value).format('YYYY-MM-DD')},
        {code: "Srcway", value: EdocsApi.findEmployeeSubdivisionByLevelAndEmployeeID(EdocsApi.getAttributeValue('Responsible').value, '1')?.unitCode},
        {code: "Koment", value: EdocsApi.getAttributeValue('DocDescription').value},
        {code: "TypeApplicant", value: getTypeApplicant(EdocsApi.getAttributeValue('ApplicantType').value)},
        {code: "FioP", value: EdocsApi.getAttributeValue('Responsible').text},
        {code: "ClaimDocs", type: "table", value: getClaimDocs()},
        {code: "ExtParentDocId", value: EdocsApi.getRelatedCases()[0].id}
    ]
}

function FixationAtributs(){
    return [
        {code: "GuiltySubjects", type: "table", value: getClaimTable_Carrier()}
    ]
}

function getClaimTable_Carrier(){
    var ClaimDocs = [];

    var table = EdocsApi.getAttributeValue('ClaimTable').value;
    if(table && table.length > 0){        
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'SubjType', value: 1},
                {code: 'SubjName', value: el.find(x => x.code == 'InvolvedUnit').text},
                {code: 'SubjID', value: el.find(x => x.code == 'InvolvedUnit').value},
                {code: 'TypeDoc', value: el.find(x => x.code == 'TypeInvoiceClaimTable').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'ClaimTableInvoice').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'DataClaimTable').value).format('YYYY-MM-DD')},                
                {code: 'CalcSum', value: el.find(x => x.code == 'ContractAmount1').value?.replace('.', ',') || null},
                {code: 'SatisfiedSum', value: el.find(x => x.code == 'ContractAmount').value?.replace('.', ',') || null}
            ]
            ClaimDocs.push(newEl);
        }
    }

    table = EdocsApi.getAttributeValue('ClaimTableCarrier').value;
    if(table && table.length > 0){
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'SubjType', value: 2},
                {code: 'SubjName', value: el.find(x => x.code == 'InvolvedCarrier').text},
                {code: 'SubjID', value: el.find(x => x.code == 'InvolvedCarrier').value},
                {code: 'TypeDoc', value: el.find(x => x.code == 'TypeInvoiceClaimTableCarrier').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'InvoiceCarrier').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'DataClaimTableCarrier').value).format('YYYY-MM-DD')},                
                {code: 'CalcSum', value: el.find(x => x.code == 'ContractAmount1').value?.replace('.', ',') || null},
                {code: 'SatisfiedSum', value: el.find(x => x.code == 'AmountCarrier').value?.replace('.', ',') || null}
            ]
            ClaimDocs.push(newEl);
        }        
    }
        return ClaimDocs;
}

function getTypeApplicant(key){
    switch (key) {
        case 'Відправник':
            return '1';
        case 'Одержувач':
            return '2';
        case 'Третя особа':
            return '3';
    
        default:
            return null;
    }
}

function getClaimDocs(){
    var table = EdocsApi.getAttributeValue('Invoice_Claim_table2').value;   

    if(table && table.length > 0){
        var ClaimDocs = [];
        for(var i=0; i<table.length; i++){
            const el = table[i];
            var newEl = [
                {code: 'TypeDoc', value: el.find(x => x.code == 'typeInvoice_Claim_table2').value},
                {code: 'NumDoc', value: el.find(x => x.code == 'Invoice_Claim_number2').value},
                {code: 'DateDoc', value: moment(el.find(x => x.code == 'dataInvoice_Claim_table2').value).format('YYYY-MM-DD')},                
                {code: 'DeclaredSum', value: el.find(x => x.code == 'Invoice_Claim_Amaunt2').value.replaceAll('.',',')}
            ]
            ClaimDocs.push(newEl);
        }
        return ClaimDocs;
    }
    else{
        return null;
    }
}

function onButtonPushButton(){
    const response = EdocsApi.runExternalFunction('PKTB', ('ClaimGetCalculationResult?idDoc='+CurrentDocument.id), null, 'get');//312345678901

    if(response && response.data && response.data.length>0){            
        var ClaimTableVal = [], ClaimTableCarrierVal = [];
        for(var i=0; i<response.data.length; i++){
            const el = response.data[i];                
            if(el.find(x=>x.code=="SubjType").value == '1'){
                const TypeInvoiceClaimTable = EdocsApi.getDictionaryItemData('ClaimDocTypes2', el.find(x => x.code == 'TypeDoc').value);
                const InvolvedUnit = EdocsApi.getOrgUnitDataByUnitID(EdocsApi.getDictionaryItemData('Units', EdocsApi.getDictionaryData('Units', '', [{attributeCode: 'UnitCode', value: el.find(x => x.code == 'SubjId').value}])[0]?.id)?.attributes.find(x=>x.code=="UnitID").value);
                    ClaimTableVal.push([
                        {code: 'InvolvedUnit', value: InvolvedUnit?InvolvedUnit.unitId:null, text: InvolvedUnit?InvolvedUnit.unitName:null},
                        {code: 'TypeInvoiceClaimTable', value: el.find(x => x.code == 'TypeDoc').value, text: TypeInvoiceClaimTable?.attributes.find(x=>x.code == 'name').value, itemCode: null, itemDictionary: 'ClaimDocTypes2'},
                        {code: 'ClaimTableInvoice', value: el.find(x => x.code == 'NumDoc').value, text: el.find(x => x.code == 'NumDoc').value},
                        {code: 'DataClaimTable', value: new Date(el.find(x => x.code == 'DateDoc').value).toISOString()},                
                        {code: 'ContractAmount1', value: el.find(x => x.code == 'CalcSum').value}
                ]);
            }
            else if(el.find(x=>x.code=="SubjType").value == '2'){

            }
        }
        var ClaimTable = EdocsApi.getAttributeValue('ClaimTable');
        var ClaimTableCarrier = EdocsApi.getAttributeValue('ClaimTableCarrier');
        ClaimTable.value = ClaimTableVal;
        ClaimTableCarrier.value = ClaimTableCarrierVal;
        EdocsApi.setAttributeValue(ClaimTable);
    }
    else{
        EdocsApi.message('Документ не існує або обрахунок ще не був проведений');
    }
}


// 17.11 Автоматичне заповненя поля Тема документу
function setTopicDocument() {
    debugger;
  var ClaimKind = EdocsApi.getAttributeValue("ClaimKind").text;
  var SaveCargoFailureType = EdocsApi.getAttributeValue(
    "SaveCargoFailureType"
  ).text;
  var RailwayConnectionType = EdocsApi.getAttributeValue(
    "RailwayConnectionType"
  ).value;
  var TopicDocument = EdocsApi.getAttributeValue("TopicDocument");

  switch (ClaimKind) {
    case "Недотримання терміну доставки вантажу":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 1;
          break;
        case "Міжнародне":
          TopicDocument.value = 2;
          break;
      }
      break;

    case "Незбережене перевезення вантажу":
      switch (SaveCargoFailureType) {
        case "Втрата вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 3;
              break;
            case "Міжнародне":
              TopicDocument.value = 4;
              break;
          }
          break;

        case "Недостача вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 5;
              break;
            case "Міжнародне":
              TopicDocument.value = 6;
              break;
          }
          break;

        case "Псування вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 7;
              break;
            case "Міжнародне":
              TopicDocument.value = 8;
              break;
          }
          break;

        case "Пошкодження вантажу":
          switch (RailwayConnectionType) {
            case "Внутрішнє":
              TopicDocument.value = 9;
              break;
            case "Міжнародне":
              TopicDocument.value = 10;
              break;
          }
          break;

        default:
            TopicDocument.value = null;
            TopicDocument.text = null;
        break;
      }
      
      break;

    case "Некоректне нарахування за перевезення вантажу та надані послуги":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 11;
          break;
        case "Міжнародне":
          TopicDocument.value = 12;
          break;
      }
      break;

    case "Інше":
      switch (RailwayConnectionType) {
        case "Внутрішнє":
          TopicDocument.value = 13;
          break;
        case "Міжнародне":
          TopicDocument.value = 14;
          break;
      }

      break;

    default:
      TopicDocument.value = null;
      TopicDocument.text = null;
      break;
  }
  EdocsApi.setAttributeValue({code:"TopicDocument", value: TopicDocument.value});
}

function onChangeSaveCargoFailureType() {
  setTopicDocument();
}
function onChangeRailwayConnectionType() {
  setTopicDocument();
}