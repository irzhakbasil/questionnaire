
export type QuestionTypesStrings = 
    'SINGLE' | 'MULTIPLE' | 'OPEN'

export enum QuestionTypes {
    SINGLE = 'Single choice',
    MULTIPLE = 'Multiple choice',
    OPEN = 'Open question'
}

const isTypeString = (value: QuestionTypesStrings): value is keyof typeof QuestionTypes => {
    return value in QuestionTypes; 
}

interface SortedQuestions {
    answeredQuestion: Question[];
    unansweredQuestion: Question[];
}

export class Question {
    creationTimestamp?: number;
    answeredTimestamp?: number;
    id?: string;
    question?: string;
    type?: string;
    answered?: boolean;
    answers?: string[];

    constructor(input: Question) {
        Object.assign(this, input);
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

    static isAnsweredTransform(insAnswered: boolean): string {
        return insAnswered ? 'Yes' : 'No';
    }

    static getEmptyQuestionObject(){
        return new Question({})
    }

    static sortQuestions(questions: Question[]): SortedQuestions {
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
            answeredQuestion,
            unansweredQuestion
        }
    }
}