import { Inject, Injectable } from '@nestjs/common';
import { AfjService  } from '../afj/afj.service';
import { OutOfBandService, OutOfBandRepository } from '@aries-framework/core'
import { OutOfBandState } from '@aries-framework/core/build/modules/oob/domain/OutOfBandState'
import { GetListDto } from './dto/getlist.dto';
var _ = require("underscore");

@Injectable()
export class ConnectionsService {
    constructor(@Inject(AfjService) private afjService: AfjService) {}
    
    getHere(): String {
        return "Connections Test Module";
    }

    async getListOOB(query: any): Promise<any> {
        console.log("Connections service - getListOOB")
        console.log("Agent=", this.afjService.afjAgent.agent)
        let outOfBandRecords = await this.afjService.afjAgent.agent.oob.getAll()
        //let outOfBandRecords = await this.ssiService.ssiAgent.agent.connections.getAll()
        // { pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object}, meta: {Object} }
        console.log("Display:", query);
        // Filter
        if(query.q) {
            outOfBandRecords = _.where(outOfBandRecords, {id: query.q});
            console.log("Filtered:", outOfBandRecords)
        }
        const totalItems = outOfBandRecords.length
        // Sort 
        if(query._order === "DESC") {
            outOfBandRecords.sort((a, b) => (a[query._sort] < b[query._sort]) ? 1 : -1)
        } 
        else {
            outOfBandRecords.sort((a, b) => (a[query._sort] > b[query._sort]) ? 1 : -1)
        }
        // Paginate
        // Return just the requested page
        let pagination =[]
        let lastOnPage = (totalItems > query._end) ? query._end : totalItems
        for(let i = query._start ; i < lastOnPage; i++) {
          console.log("ID=",outOfBandRecords[i].id)
          //let conService = this.ssiService.ssiAgent.agent.dependencyManager.resolve(OutOfBandService)
          //let oobRepo = this.ssiService.ssiAgent.agent.dependencyManager.resolve(OutOfBandRepository)
          //this.ssiService.ssiAgent.agent.oob.
          //let connection = await conService.getById(outOfBandRecords[i].id)
          //console.log("Connections=",connection.state)
          //connection.metadata.add("Test", {Test: "this is a test"});
          //console.log("Service:", await oobRepo.update(outOfBandRecords[i]))
          pagination.push(outOfBandRecords[i])
        }
        return { page: pagination, total: totalItems};  
    }


    async getListClassic(query: any): Promise<any> {
        console.log("Connections service - getListClassic")
        //console.log("Agent=", this.afjService.afjAgent.agent)
        let classicRecords = await this.afjService.afjAgent.agent.connections.getAll()
        // { pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object}, meta: {Object} }
        console.log("Display:", query);
        // Filter
        if(query.q) {
            classicRecords = _.where(classicRecords, {id: query.q});
            console.log("Filtered:", classicRecords)
        }
        const totalItems = classicRecords.length
        // Sort 
        if(query._order === "DESC") {
            classicRecords.sort((a, b) => (a[query._sort] < b[query._sort]) ? 1 : -1)
        } 
        else {
            classicRecords.sort((a, b) => (a[query._sort] > b[query._sort]) ? 1 : -1)
        }
        // Paginate
        // Return just the requested page
        let pagination =[]
        let lastOnPage = (totalItems > query._end) ? query._end : totalItems
        for(let i = query._start ; i < lastOnPage; i++) {
          console.log("ID=",classicRecords[i].id)
          pagination.push(classicRecords[i])
        }
        return { page: pagination, total: totalItems};  

    }

    async getOne(id:string): Promise<any> {
        console.log("Connections service - getListOOB")
        const connection = await this.afjService.afjAgent.agent.oob.getById(id)
        console.log("Connection=", connection)
        return connection
    }
    

}
