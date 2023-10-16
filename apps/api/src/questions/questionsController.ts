import { Controller, Route } from "tsoa";
import { QuestionsService } from "./questionsService";
//
// @Route("questions")
export class QuestionsController extends Controller {
  private questionsService;
  constructor() {
    super();
    this.questionsService = new QuestionsService();
  }
}
