import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Text } from 'src/ui/text';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	contentWidthArr,
	fontColors,
	backgroundColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useCloseOnOutsideClickOrEsc } from 'src/ui/UseCloseOnOutsideClickOrEsc';
// Типизация пропсов формы
type FormState = {
	state: ArticleStateType;
	actions: {
		apply: (nextState: ArticleStateType) => void;
		reset: () => void;
	};
};

// Тип для названий select-элементов
type TSelectName =
	| 'fontFamilyOption'
	| 'fontColor'
	| 'backgroundColor'
	| 'contentWidth';

type TFormSelect = {
	name: TSelectName;
	title: string;
	options: OptionType[];
};

// Компонент формы
export const ArticleParamsForm = (props: FormState) => {
	const [isOpen, setIsOpen] = useState(false); // Состояние открытия формы
	const sideBarRef = useRef<HTMLElement>(null); // Реф формы
	const [formState, setFormState] = useState<ArticleStateType>(props.state); // Состояние формы
	// Функция закрытия сайдбара
	const close = (): void | undefined => setIsOpen(false);
	// Хук закрытия сайдбара по нажатию вне области или
	useCloseOnOutsideClickOrEsc({
		isOpenElement: isOpen,
		elementRef: sideBarRef,
		onClose: close,
	});
	// Функция обновления одного из элементов состояния
	const update = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};
	// Функция рендера select-элемента
	const renderSelect = (selectProps: TFormSelect) => {
		return (
			<Select
				selected={formState[selectProps.name]}
				options={selectProps.options}
				title={selectProps.title}
				onChange={(selected) => update(selectProps.name, selected)}></Select>
		);
	};
	// Закрытие формы при клике вне её области
	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const handleClickOverlay = (event: MouseEvent) => {
			if (
				sideBarRef.current &&
				!sideBarRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOverlay);

		return document.removeEventListener('click', handleClickOverlay);
	}, [isOpen]);
	// Обработчики сабмита и ресета формы
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		props.actions.apply(formState);
	};
	const handleReset = (event: React.FormEvent) => {
		event.preventDefault();
		props.actions.reset();
		setFormState(props.state);
	};

	return (
		<>
			<ArrowButton
				isOpen={isOpen}
				onClick={() => {
					setIsOpen((prevState) => !prevState);
				}}
			/>
			<aside
				className={clsx(styles.container, isOpen && styles.container_opened)}
				ref={sideBarRef}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as={'h1'} size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					{renderSelect({
						title: 'Шрифт',
						name: 'fontFamilyOption',
						options: fontFamilyOptions,
					})}
					<RadioGroup
						name='font-size'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => update('fontSizeOption', option)}
						title='Размер шрифта'></RadioGroup>
					{renderSelect({
						title: 'Цвет шрифта',
						name: 'fontColor',
						options: fontColors,
					})}
					{Separator()}
					{renderSelect({
						title: 'Цвет фона',
						name: 'backgroundColor',
						options: backgroundColors,
					})}
					{renderSelect({
						title: 'Ширина контента',
						name: 'contentWidth',
						options: contentWidthArr,
					})}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
