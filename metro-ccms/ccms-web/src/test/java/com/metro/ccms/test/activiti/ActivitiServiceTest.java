package com.metro.ccms.test.activiti;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.metro.ccms.common.core.domain.Result;
import com.metro.ccms.common.exception.CustomException;
import com.metro.ccms.test.BaseTest;
import com.metro.ccms.web.activiti.config.BusinessEnum;
import com.metro.ccms.web.activiti.controller.ModelController;
import com.metro.ccms.web.activiti.domain.AutherDocumentDO;
import com.metro.ccms.web.activiti.domain.StartDO;
import com.metro.ccms.web.activiti.domain.TaskDO;
import com.metro.ccms.web.activiti.query.ModelQuery;
import com.metro.ccms.web.activiti.service.ActivitiService;
import com.metro.ccms.web.activiti.service.ModelService;
import com.metro.ccms.web.activiti.vo.TaskVO;
import com.metro.ccms.web.credit.domain.CustPrimaryDO;
import com.metro.ccms.web.utils.CommonUtils;
import com.metro.ccms.web.utils.mapper.CommonUtilsMapper;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.Process;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ExecutionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.avalon.framework.service.ServiceException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.*;

/**
 * @Author: fangyongjie
 * @Description:
 * @Date: Created in 13:19 2020/12/28
 * @Modified By:
 */
public class ActivitiServiceTest extends BaseTest {

    @Autowired
    private ModelController modelController;
    @Autowired
    private ActivitiService activitiService;
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    private CommonUtils commonUtils;
    @Autowired
    private ModelService modelService;
    @Autowired
    private CommonUtilsMapper commonUtilsMapper;
    @Autowired
    private TaskService taskService;
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private HistoryService historyService;


    @Test
    public void createActivitiModelTest(){
        try {
            JSONObject object=new JSONObject();
            object.put("name","?????????");
            object.put("bkey","CREDIT_WHITE_1");
            object.put("bname","?????????");
            Result result=modelController.createOrUpdate(object);
            System.out.println(result);
        }catch (Exception e){

        }
    }

    @Test
    public void publishTest(){
        JSONObject object=new JSONObject();
        object.put("modelId","47501");
        Result result=modelController.publish(object);
        System.out.println(result);
    }

    @Test
    public void startActivitiTest(){
        StartDO startDO=new StartDO();
        List<String> depts=new ArrayList<>();
        depts.add("80");
        Map<String,Object> mapVariable=new HashMap<>();
        mapVariable.put("approvalFlag","APPROVE");
        startDO.setVariable(mapVariable);
        startDO.setDeptCodes(depts);
        startDO.setBusinessId("111");
        startDO.setBusinessKey(BusinessEnum.CREDIT_WHITE_1);
        startDO.setFormUrl("/qqq/www/eee");
        startDO.setTitle("test");
        startDO.setStartUser("admin");
        Result result=activitiService.startProcess(startDO);
        System.out.println(result);
    }

    @Test
    public void getTaskTest(){
        //97501
        List<TaskVO> list=activitiService.getProcessActive("132501");
        System.out.println(JSON.toJSONString(list));
    }

    @Test
    public void getTodoListTest(){
        List<TaskVO> list=activitiService.getTodoList("Wang HongQiang",1,10);
        System.out.println(JSON.toJSONString(list));
    }

    @Test
    public void getHistoryTaskByUserTest(){
        List<TaskVO> list=activitiService.getHistoryTaskByUser("Xu, Wenlan",1,10);
        System.out.println(JSON.toJSONString(list));
    }

    @Test
    public void completTest(){
        Map<String,Object> mapVariable=new HashMap<>();
        mapVariable.put("approvalFlag","APPROVE");
        TaskDO taskDO=new TaskDO("132514","admin","APPROVE",false,mapVariable);
        Result result=activitiService.completeTask(taskDO);
        System.out.println(JSON.toJSONString(result));
    }

    @Test
    public void getModelTest(){
//        List<Model> list=this.repositoryService.createModelQuery().orderByModelId().asc().listPage(0,10);
        System.out.println(JSON.toJSONString(modelService.getBusinessList(new ModelQuery())));
    }

    @Test
    public void cusCodeTest(){
//        String a = "0001060";
//        int b = Integer.parseInt(a);
//        System.out.println(b);

        List<CustPrimaryDO> list=commonUtilsMapper.getPrimaryTemp();
        for (CustPrimaryDO primaryDO:list){
            Result result=commonUtils.makeCustomerCode(primaryDO.getCreditnoCcms());
            if (result.isSuccess()){
                commonUtilsMapper.updateCustCode(result.get("data").toString(),primaryDO.getId());
            }
        }
    }

    @Test
    public void sapToCrmTest(){
        int count=(int)taskService.createTaskQuery().taskCandidateOrAssigned("Nancy").active().count();
        String storeCode=commonUtils.storeCodeSapToCrm("4080");
        String cardCode=commonUtils.cardCodeSapToCrm("1011B65304");
        System.out.println(storeCode+"||"+cardCode);
    }

    @Test
    public void jsonTest(){
        String json="{\"list\":[{\"taskId\":\"85032\",\"title\":\"???????????????\",\"username\":null,\"createTime\":\"2021-01-14T14:32:06.796\",\"formUrl\":\"/customer/whitelist/list/approve\",\"businessId\":\"56\",\"roleId\":\"CFO\",\"instanceId\":\"85019\",\"type\":null,\"createTimeChange\":null,\"userId\":\"Michael\",\"validForm\":\"2021-01-15\",\"validTo\":\"2021-01-16\"},{\"taskId\":\"85014\",\"title\":\"???????????????\",\"username\":null,\"createTime\":\"2021-01-14T14:30:52.773\",\"formUrl\":\"/customer/whitelist/list/approve\",\"businessId\":\"55\",\"roleId\":\"CFO\",\"instanceId\":\"85001\",\"type\":null,\"createTimeChange\":null,\"userId\":\"Michael\",\"validForm\":\"2021-01-15\",\"validTo\":\"2021-01-16\"},{\"taskId\":\"82532\",\"title\":\"???????????????\",\"username\":null,\"createTime\":\"2021-01-14T14:29:09.659\",\"formUrl\":\"/customer/whitelist/list/approve\",\"businessId\":\"54\",\"roleId\":\"CFO\",\"instanceId\":\"82519\",\"type\":null,\"createTimeChange\":null,\"userId\":\"Michael\",\"validForm\":\"2021-01-15\",\"validTo\":\"2021-01-16\"}]}";
        JSONObject data=JSON.parseObject(json);
        Object object=data.get("list");
        JSONArray array=data.getJSONArray("list");
        List<AutherDocumentDO> list=data.getJSONArray("list").toJavaList(AutherDocumentDO.class);
        System.out.println("");
    }

    @Test
    public void modelTest(){
        try {
            Model modelData = this.repositoryService.getModel("47501");
            byte[] bytes = this.repositoryService.getModelEditorSource(modelData.getId());
            JsonNode modelNode = null;
            modelNode = (new ObjectMapper()).readTree(bytes);
            BpmnModel model = (new BpmnJsonConverter()).convertToBpmnModel(modelNode);
            Process process=model.getProcesses().get(0);
            Collection<FlowElement> list=process.getFlowElements();
            Iterator iterator=list.iterator();
            int i=1;
            UserTask userTask=null;
            while (iterator.hasNext()){
                Object object=iterator.next();
                if (i==2){
                    userTask=(UserTask) object;
                    break;
                }
                i++;
            }
            List<String> roles=userTask.getCandidateGroups();
            System.out.println("=======");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void nextTaskTest(){
        //187520
        Task task=taskService.createTaskQuery().processInstanceId("187520").singleResult();
        if (task==null){
            throw new CustomException("?????????????????????????????????");
        }
        // ????????????????????????
        HistoricTaskInstance historicTaskInstance = historyService.createHistoricTaskInstanceQuery()
                .taskId(task.getId()).singleResult();
        //??????????????????
        ProcessDefinition processDefinition=repositoryService.getProcessDefinition(historicTaskInstance.getProcessDefinitionId());

        //???????????????????????????ID
        ExecutionQuery executionQuery =runtimeService.createExecutionQuery();
        Execution execution =executionQuery.executionId(historicTaskInstance.getExecutionId()).singleResult();
        String activityId=execution.getActivityId();
        UserTask userTask =null;
        while (true){
            //?????????????????????????????????????????????
            FlowNode flowNode =getFlowNode(processDefinition.getId(),activityId);
            //??????????????????????????????/?????????????????????
            List<SequenceFlow> sequenceFlowListOutGoing=flowNode.getOutgoingFlows();
//        List<SequenceFlow> sequenceFlowListIncoming=flowNode.getIncomingFlows();

            //?????????????????????????????????userTask??????????????????????????????????????????????????????
            //sequenceFlowListOutGoing??????????????????1,?????????????????????,?????????????????????
            FlowElement flowElement =sequenceFlowListOutGoing.get(0).getTargetFlowElement();
            if (flowElement instanceof UserTask){
                userTask =(UserTask)flowElement;
                break;
            }else {
                //????????????????????????userTask???????????????,??????????????????????????????????????????,???????????????userTask??????????????????
                String flowElementId=flowElement.getId();
                activityId=flowElementId;
                continue;
            }
        }
        List<String> roles=userTask.getCandidateGroups();
        System.out.println("=======");

    }

    //?????????????????????????????????ID????????????????????????????????????

    public FlowNode getFlowNode(String processDefinitionId, String activityId){
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
        FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(activityId);
        return flowNode;
    }
}
