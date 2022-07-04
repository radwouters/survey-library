import * as React from "react";
import {
  SurveyQuestionUncontrolledElement,
  ReactSurveyElement,
} from "./reactquestion_element";
import { Question } from "survey-core";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { Base } from "../base";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionDropdownBase<T extends Question> extends SurveyQuestionUncontrolledElement<T> {
  onClick = (event: any) => {
    !!this.question.onOpenedCallBack && this.question.onOpenedCallBack();
  }

  protected setValueCore(newValue: any) {
    this.questionBase.renderedValue = newValue;
  }
  protected getValueCore(): any {
    return this.questionBase.renderedValue;
  }
  protected renderSelect(cssClasses: any): JSX.Element {
    const selectElement = this.isDisplayMode ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <div id={this.question.inputId} className={this.question.getControlClass()} disabled>{ this.question.readOnlyText }</div>):
      (<select
        id={this.question.inputId}
        className={this.question.getControlClass()}
        ref={(select) => (this.control = select)}
        autoComplete={this.question.autoComplete}
        onChange={this.updateValueOnEvent}
        onInput={this.updateValueOnEvent}
        onClick={this.onClick}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
        required={this.question.isRequired}>
        { this.question.allowClear ? (<option value="">{this.question.placeholder}</option>) : null }
        { this.question.visibleChoices.map((item: ItemValue, i: number) => <SurveyQuestionOptionItem key={"item" + i} item={item}/>) }
      </select>);
    return (
      <div className={cssClasses.selectWrapper}>
        {selectElement}
      </div>
    );
  }
}

export class SurveyQuestionDropdown extends SurveyQuestionDropdownBase<Question> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var comment = this.question.isOtherSelected
      ? this.renderOther(cssClasses)
      : null;
    var select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.renderCssRoot}>
        {select}
        {comment}
      </div>
    );
  }
  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className="form-group">
        <SurveyQuestionCommentItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
}

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.state = { changed: 0 };
    this.setupModel();
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.setupModel();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if(!!this.item) {
      this.item.locText.onChanged = () => {};
    }
  }
  private setupModel(): void {
    if (!this.item.locText) return;
    const self = this;
    this.item.locText.onChanged = () => {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  protected getStateElement(): Base {
    return this.item;
  }
  private get item(): ItemValue {
    return this.props.item;
  }
  protected canRender(): boolean {
    return !!this.item;
  }
  protected renderElement(): JSX.Element {
    return (
      <option value={this.item.value} disabled={!this.item.isEnabled}>
        {this.item.text}
      </option>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", (props) => {
  return React.createElement(SurveyQuestionDropdown, props);
});
