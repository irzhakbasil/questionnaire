import { nanoid } from "nanoid";

export type QuestionTypesStrings = 
    'SINGLE' | 'MULTIPLE' | 'OPEN'

export enum QuestionTypes {
    SINGLE = 'Single choice',
    MULTIPLE = 'Multiple choice',
    OPEN = 'Open question'
}

export enum QuestionTypesConsts {
    SINGLE = 'SINGLE',
    MULTIPLE = 'MULTIPLE',
    OPEN = 'OPEN'
}

export enum QuestionLifecircleMode {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    RESTORE = 'RESTORE',
    ANSWER = 'ANSWER',
    UNANSWER = 'UNANSWER'
}
interface SortedQuestions {
    answeredQuestion: Question[];
    unansweredQuestion: Question[];
}

const QuestionInitializer: Question = {
    creationTimestamp: new Date().getTime(),
    answeredTimestamp: new Date().getTime(),
    question: '',
    type: '',
    answered: false,
}
export class Question {
    creationTimestamp: number;
    answeredTimestamp: number;
    id?: string;
    question: string;
    type: string;
    answered: boolean;
    answers?: string[];
    answersChosenByUser?: string[]

    constructor(input: Question, mode: QuestionLifecircleMode) {
        this.question = input.question;
        this.type = input.type;
        this.answered = input.answered;
        this.creationTimestamp = input.creationTimestamp;
        this.answeredTimestamp = input.answeredTimestamp;
        this.id = input.id;
        if(input.answers) {
            this.answers = input.answers;
        }
        if(input.answersChosenByUser) {
            this.answersChosenByUser = input.answersChosenByUser;
        }
        if(input.answeredTimestamp) {
            this.answeredTimestamp = input.answeredTimestamp;
        }
        if (mode === QuestionLifecircleMode.UNANSWER) {
            this.answered = false;
            this.answersChosenByUser = [];
            this.answeredTimestamp = this.creationTimestamp;
        }
    }

    static getDateString(creationTimestamp: number): string {
        return new Date(creationTimestamp).toLocaleDateString("en-US");
    }

    static getQuestionType(type: QuestionTypes): string {
        return Object.keys(QuestionTypes)[Object.values(QuestionTypes).indexOf(type)]
    }

    static getQuestionTypeString(value: QuestionTypesStrings): string {
        return QuestionTypes[value];
    }

    static isAnsweredTransform(insAnswered: boolean): string  {
        return insAnswered ? 'Yes' : 'No';
    }

    static getEmptyQuestionObject(){
        return new Question(QuestionInitializer, QuestionLifecircleMode.CREATE)
    }

    static sortQuestionsByisAnswered(questions: Question[]): SortedQuestions { // reduce
        const answeredQuestion: Question[] = [];
        const unansweredQuestion: Question[] = [];
        questions.forEach(question => {
            if(question.answered) {
                answeredQuestion.push(question);
            } else {
                unansweredQuestion.push(question);
            }
        })
        return {
            answeredQuestion: Question.sortQuestionByUnswerDate(answeredQuestion),
            unansweredQuestion
        }
    }
    
    static sortQuestionByCreationDate(questions: Question[]) {
        return questions.sort(function(a, b){
            return b.creationTimestamp - a.creationTimestamp;
        })
    }

    static sortQuestionByUnswerDate(questions: Question[]) {
        return questions.sort(function(a, b){
            return a.answeredTimestamp - b.answeredTimestamp;
        })
    } 
}