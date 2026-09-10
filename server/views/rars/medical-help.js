import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails, titleHelper } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_MEDICAL_HELP
const verminQuestion = 'Do you know the site or business responsible for the {vermin}?'

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createMedicalHelpRoutes = ({ problem, route, redirect 
}) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const { title, pageTitle} = titleHelper(request, question.text, verminQuestion, problem)
      return 
      h.view(constants.views.RARS_MEDICAL_HELP, {
        question,
        problem,
        title,
        pageTitle,
        ...serviceDetails
      })
    },
    
  }
}

