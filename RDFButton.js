/**
 * @desc   通用点击控件
 * @author wangning
 * @date   2017/2/9:11:45
 */
'use strict';
import React, {Component, PropTypes} from "react";
import {TouchableHighlight, TouchableWithoutFeedback, View, Text, StyleSheet, Image} from "react-native";

const INTERVAL = 250;

export default class RDFButton extends Component {

	static ButtonState = {
		normal: 0,
		highlighted: 1,
		disabled: 2,
		selected: 3,
	};

	static propTypes = {
		...TouchableWithoutFeedback.propTypes,
		/**
		 * 最小点击间隔
		 */
		interval: PropTypes.number,
		/**
		 * 文案
		 */
		text: PropTypes.string,
		/**
		 * 文字大小
		 */
		fontSize: PropTypes.number,
		/**
		 * 文字颜色
		 */
		textColor: PropTypes.string,
		/**
		 * 背景颜色
		 */
		backgroundColor: PropTypes.string,
		/**
		 * 背景图片
		 */
		backgroundImage: PropTypes.number,
		/**
		 * 图片
		 */
		image: PropTypes.number,
		/**
		 * 图片位置
		 */
		imagePosition: PropTypes.oneOf('left', 'right', 'top', 'bottom'),
		/**
		 * 摁下的背景颜色
		 */
		highlightedColor: PropTypes.string,
		/**
		 * 摁下的图片
		 */
		highlightedImage: PropTypes.number,
		/**
		 * 摁下的背景图片
		 */
		highlightedBackgroundImage: PropTypes.number,
		/**
		 * 是否可禁用点击事件
		 */
		disabled: PropTypes.bool,
		/**
		 * 不可点击的颜色
		 */
		disabledColor: PropTypes.string,
		/**
		 * 不可点击时候显示的图片
		 */
		disabledImage: PropTypes.number,
		/**
		 * 不可点击时候显示的背景图片
		 */
		disabledBackgroundImage: PropTypes.number,
		/**
		 * 选中的颜色
		 */
		selectedColor: PropTypes.string,
		/**
		 * 选中的图片
		 */
		selectedImage: PropTypes.number,
		/**
		 * 选中的背景图片
		 */
		selectedBackgroundImage: PropTypes.number,
		/**
		 * 边框宽度
		 */
		borderWidth: PropTypes.number,
		/**
		 * 边框颜色
		 */
		borderColor: PropTypes.string,
		/**
		 * 边框圆角
		 */
		borderRadius: PropTypes.number,
		/**
		 * 按钮状态
		 */
		buttonState: PropTypes.number,
	};

	static defaultProps = {
		textColor: 'black',
		fontSize: 14,
		imagePosition: 'left',
	};

	constructor(props) {
		super(props);
		const initialButtonState = this.props.buttonState || (this.props.disabled ? RDFButton.ButtonState.disabled : RDFButton.ButtonState.normal);
		this.state = {
			buttonState: initialButtonState,
			buttonStateBeforePressedIn: initialButtonState,
			currentTime: 0,
		};
	}

	render() {
		let touchableProps = {};
		if (!this.props.disabled) {
			touchableProps.onPress = this.props.onPress;
			touchableProps.onPressIn = this.props.onPressIn;
			touchableProps.onPressOut = this.props.onPressOut;
			touchableProps.onLongPress = this.props.onLongPress;
		}

		const {image, backgroundColor, backgroundImage} = this.displayParameters();
		const iconElement = image && this.renderImage(image);
		const TouchableComponent = backgroundImage ? TouchableWithoutFeedback : TouchableHighlight;
		return (
			<Image
				source={backgroundImage}
				style={[
					this.props.style,
					{
						resizeMode: 'stretch',
						borderWidth: this.props.borderWidth,
						borderRadius: this.props.borderRadius,
						borderColor: this.props.borderColor,
					}
				]}>
				<TouchableComponent
					{...touchableProps}
					disabled={this.props.disabled || false}
					onPress={() => this.onPress()}
					onPressIn={() => this.onPressIn()}
					onPressOut={() => this.onPressOut()}
					underlayColor={this.props.highlightedColor}
					style={styles.touchableContent}>
					<View style={[
						styles.touchableContent,
						{
							backgroundColor,
							flexDirection: (this.props.imagePosition == 'left' || this.props.imagePosition == 'right') ? 'row' : 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}
					]}>
						{this.props.imagePosition && (this.props.imagePosition == 'left' || this.props.imagePosition == 'top') && iconElement}
						{this.props.text && this.renderText()}
						{this.props.imagePosition && (this.props.imagePosition == 'right' || this.props.imagePosition == 'bottom') && iconElement}
					</View>
				</TouchableComponent>
			</Image>
		);
	}

	/**
	 * 返回内容
	 * @returns {XML}
	 * @private
	 */
	renderText() {
		return (
			<Text style={[
				{
					fontSize: this.props.fontSize,
					color: this.props.textColor,
					backgroundColor: 'transparent',
				}
			]}>
				{this.props.text}
			</Text>
		);
	}

	renderImage(image) {
		return (<Image source={image}/>);
	}

	displayParameters() {
		let image = this.props.image;
		let backgroundColor = this.props.backgroundColor;
		let backgroundImage = this.props.backgroundImage;
		switch (this.state.buttonState) {
			case RDFButton.ButtonState.highlighted: {
				image = this.props.highlightedImage || image;
				backgroundColor = this.props.highlightedColor || backgroundColor;
				backgroundImage = this.props.highlightedBackgroundImage || backgroundImage;
				break;
			}
			case RDFButton.ButtonState.disabled: {
				image = this.props.disabledImage || image;
				backgroundColor = this.props.disabledColor || backgroundColor;
				backgroundImage = this.props.disabledBackgroundImage || backgroundImage;
				break;
			}
			case RDFButton.ButtonState.selected: {
				image = this.props.selectedImage || image;
				backgroundColor = this.props.selectedColor || backgroundColor;
				backgroundImage = this.props.selectedBackgroundImage || backgroundImage;
				break;
			}
		}
		return {
			image,
			backgroundColor,
			backgroundImage,
		}
	}

	/**
	 * 点击事件
	 * @private
	 */
	onPress() {
		let time = new Date().valueOf();
		if (time - this.state.currentTime <= this.getInterval()) {
			return;
		}
		this.props.onPress();
		this.setState({currentTime: time});
	}

	onPressIn() {
		const buttonStateBeforePressedIn = this.state.buttonState;
		this.setState({
			buttonState: RDFButton.ButtonState.highlighted,
			buttonStateBeforePressedIn,
		});
		this.props.onPressIn && this.props.onPressIn();
	}

	onPressOut() {
		this.setState({buttonState: this.state.buttonStateBeforePressedIn});
		this.props.onPressOut && this.props.onPressOut();
	}

	/**
	 * 获取两次点击的最小时间间隔
	 * @returns {Number|number}
	 * @private
	 */
	getInterval() {
		return this.props.interval || INTERVAL;
	}
}

const styles = StyleSheet.create({
	touchableContent: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},
});

