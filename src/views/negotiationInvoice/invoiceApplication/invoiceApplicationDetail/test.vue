
   <div class="table" v-for="(item_,idnex_) in piaoNum" :key="idnex_">
          <el-row>
            <el-col :span="24">
              <h5>
                <span class="mark"></span>
                <span class="tit">发票{{idnex_+1}}</span>
              </h5>
            </el-col>
            <el-col :span="24">
              <el-button type="primary" size="mini" @click="AddDetails(idnex_)">添加行</el-button>
              <el-button size="mini" @click="delBtn(idnex_)">删除发票</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <div>
            <el-form
              size="mini"
              :model="resultForm"
              :rules="resultForm.resultRuls"
              ref="resultForm"
            >
              <el-table
                empty-text="暂无数据，可 添加行 进行填写"
                ref="multipleTable"
                :data="piaoNum[idnex_].InvoiceItem"
                stripe
                style="width: 100%"
                v-loading="searchLoading"
                resizable
                highlight-current-row
              >
                <el-table-column align="center" label="行项目" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="ProjectNumber">
                      <el-input v-model="scope.row.ProjectNumber" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="ElabName" label="品名" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="ElabName'">
                      <el-select v-model="scope.row.ElabName" size="mini">
                        <el-option
                          v-for="item in ElabList"
                          :key="item.cno"
                          :label="item.nameCn"
                          :value="item.cno"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="ElabCode" label="产品号" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="'ElabCode'">
                      <el-input v-model="scope.row.ElabCode" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="TransactionType" width="180">
                  <template slot="header">
                    <span style="color:red">*</span> 交易类型
                  </template>
                  <template slot-scope="scope">
                    <el-form-item prop="TransactionType'">
                      <el-select v-model="scope.row.TransactionType" size="mini">
                        <el-option
                          v-for="item in typeList"
                          :key="item.Key"
                          :label="item.Value"
                          :value="item.Key"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="InvoiceAmount" width="180">
                  <template slot="header" slot-scope="scope">
                    <span style="color:red">*</span>发票金额(CNY)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item prop="InvoiceAmount">
                      <el-input v-model="scope.row.InvoiceAmount" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="InvoiceRate" width="180">
                  <template slot="header" slot-scope="scope">
                    <span style="color:red">*</span>销项税率
                  </template>
                  <template slot-scope="scope">
                    <el-form-item prop="InvoiceRate">
                      <el-select v-model="scope.row.InvoiceRate" size="mini">
                        <el-option
                          v-for="item in taxList"
                          :key="item.value"
                          :label="item.label+'%'"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Num" label="数量" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="Num">
                      <el-input v-model="scope.row.Num" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Unit" label="单位" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="Unit">
                      <el-input v-model="scope.row.Unit" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="InvoicRemarks" label="备注" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="InvoicRemarks">
                      <el-input v-model="scope.row.InvoicRemarks" size="mini" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="datashuju" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="del(scope.$index,idnex_)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>



                 <el-table-column align="center" label="行项目" width="80">
                            <template slot-scope="scope">
                                <el-form-item prop="ProjectNumber">
                                    {{ scope.row.ProjectNumber }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="ElabName" label="品名" width="130">
                            <template slot-scope="scope">
                                <el-form-item prop="ElabName'">
                                    {{ scope.row.ElabName }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="ElabCode" label="产品号" width="130">
                            <template slot-scope="scope">
                                <el-form-item prop="'ElabCode'">
                                    {{ scope.row.ElabCode }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="TransactionType" width="130">
                            <template slot="header">
                                <span style="color:red">*</span> 交易类型
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="TransactionType'">
                                    {{
                                            scope.row.TransactionType == "ZADS" ? "收费样品" :
                                                (scope.row.TransactionType == "TAD" ? "服务" :
                                                    (scope.row.TransactionType == "TAN" ? "产品交付" :
                                                        (scope.row.TransactionType == "ZADZ" ? "免费样品" : "")))
                                    }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="InvoiceAmount" width="130">
                            <template slot="header" slot-scope="scope">
                                <span style="color:red">*</span>发票金额
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="InvoiceAmount">
                                    {{ scope.row.InvoiceAmount }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="InvoiceRate" width="130">
                            <template slot="header" slot-scope="scope">
                                <span style="color:red">*</span>销项税率
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="InvoiceRate">
                                    {{ scope.row.InvoiceRate }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Num" label="数量" width="120">
                            <template slot-scope="scope">
                                <el-form-item prop="Num">
                                    {{ scope.row.Num }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Unit" label="单位" width="120">
                            <template slot-scope="scope">
                                <el-form-item prop="Unit">
                                    {{ scope.row.Unit }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="InvoicRemarks" label="备注" width="120">
                            <template slot-scope="scope">
                                <el-form-item prop="InvoicRemarks">
                                    {{ scope.row.InvoicRemarks }}
                                </el-form-item>
                            </template>
                        </el-table-column>