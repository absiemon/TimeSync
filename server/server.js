import express from "express";
import cors from "cors";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config();

import employee from './router/employee_router.js'
import employeeIssue from './router/employeeIssue_router.js'
import employeeContract from './router/employeeContract_router.js'
import employeeLeave from './router/employeeLeave_router.js'
import attendance from './router/attendance_router.js'
import authRoute from './router/authRoute.js'
import miscellaneous from './router/miscellaneous_router.js'
import designation from './router/designation_router.js'
import department from './router/department_router.js'
import announcement from './router/announcement_router.js'

import DealRoute from './router/deal_router.js'
import PipelineRoute from './router/pipeline_router.js'

import personsRoute from './router/persons_router.js'
import organizationRoute from './router/organization_router.js'
import leadGropuRoute from './router/leadGroup_router.js'

import proposalRoute from './router/proposal_router.js'
import emergencyContactRoute from './router/emergencyContact_router.js'

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb'
}))
app.use(morgan());
app.disable('etag')

const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

app.use(cors());


app.use('/api/employee', employee);
app.use('/api/employee-issue', employeeIssue);
app.use('/api/employee-contract', employeeContract);
app.use('/api/leave', employeeLeave);
app.use('/api/attendance', attendance);
app.use('/api/auth', authRoute);

app.use('/api/mis', miscellaneous);
app.use('/api/designation', designation);
app.use('/api/department', department);
app.use('/api/announcement', announcement);

app.use('/api/deal', DealRoute);
app.use('/api/pipeline', PipelineRoute);

app.use('/api/persons', personsRoute);
app.use('/api/organization', organizationRoute);
app.use('/api/lead_group', leadGropuRoute);

app.use('/api/proposal', proposalRoute);
app.use('/api/emg_contact', emergencyContactRoute);

const port = process.env.PORT || 8000;

const server = app.listen(port);
