export const CONTROLS_ARRAY_MAX_LENGTH = 5;
export const CREATE_QUESTION_MIN_FILLED_IN_INPUTS = 2;

export enum AppRoutesEnum {
    MANAGE_QUESTIONS_ROOT = '/manage-questions',
    MANAGE_QUESTIONS_RELATIVE = 'manage-questions',
    CREATE_QUESTION = 'manage-questions/create-question',
    EDIT_QUESTION = 'manage-questions/edit-question/:id',
    LIST_OF_QUESTIONS_RElATIVE = 'list-of-questions',
    LIST_OF_QUESTIONS_ROOT = '/list-of-questions',
    EDIT_QUESTIONS_RELATIVE = 'edit-question'
}