package com.metro.ccms.web.collection.service.impl;

import com.metro.ccms.common.core.domain.Result;
import com.metro.ccms.common.core.domain.model.LoginUser;
import com.metro.ccms.common.utils.SecurityUtils;
import com.metro.ccms.system.domain.SysBasicFile;
import com.metro.ccms.system.service.ISysFileService;
import com.metro.ccms.web.collection.vo.CollectionAndDetailVO;
import com.metro.ccms.web.collection.vo.CollectionVO;
import com.metro.ccms.web.collection.domian.*;
import com.metro.ccms.web.collection.mapper.CollectionMapper;
import com.metro.ccms.web.collection.query.CollectionQuery;
import com.metro.ccms.web.collection.service.CollectionService;
import com.metro.ccms.web.collection.vo.CollectionletterVO;
import com.metro.ccms.web.httpsInterface.domain.BsegInterfaceDO;
import com.metro.ccms.web.utils.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import javax.annotation.Resource;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Date;
import java.util.List;

/**
* @description
* @author weiwenhui
* @date 2020/12/11 17:56
*/
@Service
public class CollectionServiceImpl implements CollectionService {
    private static final Logger logger = LoggerFactory.getLogger(CollectionServiceImpl.class);
    @Resource
    private CollectionMapper collectionMapper;
    @Resource
    private ISysFileService iSysFileService;
    @Resource
    private CommonUtils commonUtils;

    @Override
    public List<CollectionVO> selectCollection(CollectionQuery collectionQuery) {
        return collectionMapper.selectCollection(collectionQuery);
    }

    @Override
    public CollectionAndDetailVO selectCollectionDetail(CollectionDO collectionDO) {
        CollectionAndDetailVO collectionDetailVO = new CollectionAndDetailVO();
        CollectionVO collection = collectionMapper.selPdfInfo(collectionDO.getId());
        List<CollectionDetailDO> collectionDetailDOList = collectionMapper.getCollectionDetails(collection.getApplicationNo());
        List<CollectionRecordDO> collectionRecordDOList = collectionMapper.getCollectionRecords(collection.getApplicationNo());
        //??????????????????
        List<SysBasicFile> sysBasicFiles = iSysFileService.getFileList(collectionDO.getId().toString(),"10");
        collectionDetailVO.setSysBasicFile(sysBasicFiles);
        collectionDetailVO.setCollectionVO(collection);
        collectionDetailVO.setCollectionDetailDO(collectionDetailDOList);
        collectionDetailVO.setCollectionRecordDO(collectionRecordDOList);
        return collectionDetailVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result saveCollection(CollectionAndDetailVO collectionAndDetailVO) {
        try {
            //??????????????????
            LoginUser loginUser = SecurityUtils.getLoginUser();
            List<CollectionRecordDO> listRecord =collectionAndDetailVO.getCollectionRecordDO();
            //????????????????????????????????????????????????
            collectionMapper.delTzInfo(loginUser.getUser().getNickName(),collectionAndDetailVO.getCollectionVO().getApplicationNo());
            //??????ID?????????????????????????????????????????????
            for (CollectionRecordDO collectionRecordDO:listRecord) {
                if (collectionRecordDO.getId()!=null){
                    //?????????????????????????????????????????????
                    collectionRecordDO.setDeleted(0);
                    //???????????????
                    collectionRecordDO.setUpdatedBy(loginUser.getUser().getNickName());
                    collectionMapper.updateTzInfo(collectionRecordDO);
                }
                else {
                    collectionRecordDO.setApplicationNo(collectionAndDetailVO.getCollectionVO().getApplicationNo());
                    collectionRecordDO.setDepartCode(collectionAndDetailVO.getCollectionVO().getDepartCode());
                    collectionRecordDO.setStoreCode(collectionAndDetailVO.getCollectionVO().getStoreCode());
                    //???????????????
                    collectionRecordDO.setCreatedBy(loginUser.getUser().getNickName());
                    collectionMapper.saveTzInfo(collectionRecordDO);
                }
            }
            //???????????????????????????????????????????????????????????????????????????????????????
            int count = collectionMapper.selCountRecord(collectionAndDetailVO.getCollectionVO().getApplicationNo());
            if(count <= 0 ){
                collectionMapper.upunningStatusForappNo(collectionAndDetailVO.getCollectionVO().getApplicationNo());
            }else {
                //??????????????????????????????????????????????????????????????????????????????????????????
                collectionMapper.updunningStatus(collectionAndDetailVO.getCollectionVO().getApplicationNo());
            }
        }
        catch (Exception e){
            // ??????????????????
            logger.error(getExceptionInfo(e));
            // ???catch???????????????????????????
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            // TODO ???????????????
            return Result.error("???????????????");
        }
        return Result.success("???????????????");
    }
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result deleteCollection(CollectionDO collectionDO) {
        try {
            LoginUser loginUser = SecurityUtils.getLoginUser();
            int record = collectionMapper.selCountRecord(collectionDO.getApplicationNo());
            if(record>=1){
                return Result.error("?????????????????????????????????");
            }
            collectionDO.setUpdatedBy(loginUser.getUser().getNickName());
            collectionMapper.deleteCollection(collectionDO);
        }
        catch (Exception e){
            // ??????????????????
            logger.error(getExceptionInfo(e));
            // ???catch???????????????????????????
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            // TODO ???????????????
            return Result.error("???????????????");
        }
        return Result.success("???????????????");
    }

    /**
     * ????????????PDF????????????id??????
     */

    @Override
    public CollectionletterVO selPdfInfo(CollectionVO collectionVO) {
        CollectionletterVO collectionletterVO = new CollectionletterVO();
        CollectionVO coll = collectionMapper.selPdfInfo(collectionVO.getId());
        if ((coll.getIdueheji365()!=null && coll.getIdueheji365()>0) || (coll.getIdue090()!=null && coll.getIdue090()>0)){
            coll.setIflag("??????60???");
        }else if (coll.getIdue060()!=null && coll.getIdue060()>0){
            coll.setIflag("??????30???");
        }
        else{
            coll.setIflag("??????15???");
        }
        List<Date> fdate = collectionMapper.selDate(coll);
        List<CollectionDetailDO> collDetails = collectionMapper.getCollectionDetails(collectionVO.getApplicationNo());
        collectionletterVO.setCollectionVO(coll);
        collectionletterVO.setFdate(fdate);
        collectionletterVO.setCollectionDetailDO(collDetails);
        return collectionletterVO;
    }

    /**
     * ????????????????????????
     * @param bsegInterfaceDO
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result insertCollection(BsegInterfaceDO bsegInterfaceDO) {
        try {
            //??????????????????
            LoginUser loginUser = SecurityUtils.getLoginUser();
            //????????????
            List<BsegInterfaceDO> bsegInterfaceDOList =collectionMapper.selRange(bsegInterfaceDO);
            if(bsegInterfaceDOList.size()<=0){
                return Result.error("??????????????????????????????");
            }
            BsegInterfaceDO b= bsegInterfaceDOList.get(0);
            //????????????
            CollectionDO collectionDO = selMoney(bsegInterfaceDO);
            if (collectionDO ==null){
                return Result.error("??????????????????????????????");
            }
            collectionDO.setCardName(b.getCardName());
            collectionDO.setCardCode(b.getCustomerId());
            collectionDO.setStoreCode(b.getStoreId());
            collectionDO.setDepartCode(b.getDepartCode());
            collectionDO.setCustCode(b.getCustCode());
            collectionDO.setCustName(b.getCustName());
            collectionDO.setCreatedBy(loginUser.getUser().getNickName());
            collectionDO.setDdate(bsegInterfaceDO.getZaldt());
            //????????????id???????????????
            String id =collectionMapper.selmaxid(collectionDO);
            String applicationNo = commonUtils.getApplicationNo(Long.parseLong(id==null ? "0":id),6);
            collectionDO.setApplicationNo(applicationNo);
            //?????????????????????
            collectionMapper.saveDunning(collectionDO);
            //??????list?????????????????????
             for (BsegInterfaceDO bseg: bsegInterfaceDOList
                ) {
                 CollectionDetailDO collectionDetailDO= new CollectionDetailDO();
                 collectionDetailDO.setCreatedBy(loginUser.getUser().getNickName());
                 collectionDetailDO.setApplicationNo(collectionDO.getApplicationNo());
                 collectionDetailDO.setCardName(bseg.getCardName());
                 collectionDetailDO.setCustName(bseg.getCustName());
                 collectionDetailDO.setCustCode(bseg.getCustCode());
                 collectionDetailDO.setDepartCode(bseg.getDepartCode());
                 collectionDetailDO.setAmount(bseg.getWrbtr());
                 collectionDetailDO.setCardCode(bseg.getCustomerId());
                 collectionDetailDO.setCsbvcode(bseg.getBelnr());
                 collectionDetailDO.setDduedate(bseg.getZaldt());
                 collectionDetailDO.setDsbvdate(bseg.getBudat());
                 collectionDetailDO.setPaymentTerm(bseg.getZterm());
                 collectionDetailDO.setStandardCurrency(bseg.getlWaers());
                 collectionDetailDO.setStoreCode(bseg.getStoreId());
                 collectionMapper.saveDunningDetail(collectionDetailDO);
                }
            
        }catch (Exception e){
            // ??????????????????
            logger.error(getExceptionInfo(e));
            // ???catch???????????????????????????
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            // TODO ???????????????
            return Result.error("???????????????");
        }
        return Result.success("???????????????");
    }

    /**
     * ????????????????????????????????????
     * @param bsegInterfaceDO
     * @return
     */
    public CollectionDO selMoney(BsegInterfaceDO bsegInterfaceDO) {
        CollectionDO collectionDO =new CollectionDO();
        collectionDO.setIdue015(collectionMapper.selIdueDay(bsegInterfaceDO,"0","15"));
        collectionDO.setIdue030(collectionMapper.selIdueDay(bsegInterfaceDO,"16","30"));
        collectionDO.setIdue060(collectionMapper.selIdueDay(bsegInterfaceDO,"31","60"));
        collectionDO.setIdue090(collectionMapper.selIdueDay(bsegInterfaceDO,"61","90"));
        collectionDO.setIdue180(collectionMapper.selIdueDay(bsegInterfaceDO,"151","180"));
        collectionDO.setIdue360(collectionMapper.selIdueDay(bsegInterfaceDO,"331","360"));
        collectionDO.setIdue361(collectionMapper.selIdueDay(bsegInterfaceDO,"361","720"));
        collectionDO.setIdue120(collectionMapper.selIdueDay(bsegInterfaceDO,"91","120"));
        collectionDO.setIdue150(collectionMapper.selIdueDay(bsegInterfaceDO,"121","150"));
        collectionDO.setIdue210(collectionMapper.selIdueDay(bsegInterfaceDO,"181","210"));
        collectionDO.setIdue240(collectionMapper.selIdueDay(bsegInterfaceDO,"211","240"));
        collectionDO.setIdue270(collectionMapper.selIdueDay(bsegInterfaceDO,"241","270"));
        collectionDO.setIdue300(collectionMapper.selIdueDay(bsegInterfaceDO,"271","300"));
        collectionDO.setIdue330(collectionMapper.selIdueDay(bsegInterfaceDO,"301","330"));
        collectionDO.setIdue721(collectionMapper.sel721Idue(bsegInterfaceDO));
        collectionDO.setIdue(collectionMapper.selIdue(bsegInterfaceDO));
        collectionDO.setIar(collectionMapper.selIar(bsegInterfaceDO));
        collectionDO.setUndue(collectionMapper.selUndue(bsegInterfaceDO));
        return collectionDO;
    }
    /**
     * ??????????????????????????????
     * @param bsegInterfaceDO
     * @return
     */
    @Override
    public List<BsegInterfaceDO> selRange(BsegInterfaceDO bsegInterfaceDO) {
        return collectionMapper.selRange(bsegInterfaceDO);
    }

    /**
     * ????????????????????????string??????
     * @param e ??????
     * @return string??????????????????
     */
    public static String getExceptionInfo(Exception e) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        e.printStackTrace(new PrintStream(baos));
        return baos.toString();
    }
}
