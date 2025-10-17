import { useState } from 'react';
import { IProduct } from '../models';
import axios from 'axios';
import { ErrorMessage } from './ErrorMessage';

// const productData: IProduct = {
// 	title: '',
// 	price: 0.1,
// 	description: 'lorem ipsum set',
// 	category: 'electronic',
// 	image:
// 		'https://cdn6.aptoide.com/imgs/b/2/1/b21b400cced6834e25c42111285f68d1_icon.png',
// 	rating: {
// 		rate: 42,
// 		count: 10,
// 	},
// };

const fields = ['title', 'price', 'description', 'category', 'image'] as const;

interface CreateProductProps {
	onCreate: (product: IProduct) => void;
}

export function CreateProduct({ onCreate }: CreateProductProps) {
	const [form, setForm] = useState<IProduct>({
		title: '',
		price: 0,
		description: '',
		category: '',
		image: '',
		rating: {
			rate: 0,
			count: 0,
		},
	});

	const [value, setValue] = useState('');
	const [error, setError] = useState('');

	const submitHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');

		// if (value.trim().length === 0) {
		// 	setError('Please, enter valid title.');
		// 	return;
		// }

		for (const field of fields) {
			const val = form[field];

			if (
				(typeof val === 'string' && val.trim() === '') ||
				(typeof val === 'number' && isNaN(val))
			) {
				setError(`Please, enter valid ${field}.`);
				return;
			}
		}

		// productData.title = value;
		const productData: IProduct = { ...form };

		const response = await axios.post<IProduct>(
			'https://fakestoreapi.com/products',
			productData
		);

		onCreate(response.data);
	};

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setValue(event.target.value);

		const { name, value } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: name === 'price' ? parseFloat(value) : value,
		}));
	};

	return (
		<form onSubmit={submitHandler}>
			{/* <input
				type="text"
				className="border py-2 px-4 mb-2 w-full outline-0"
				placeholder="Enter product title..."
				value={value}
				onChange={changeHandler}
			/>

			<input
				type="text"
				className="border py-2 px-4 mb-2 w-full outline-0"
				placeholder="Enter product price..."
				value={value}
				onChange={changeHandler}
			/> */}

			{fields.map((field) => (
				<input
					key={field}
					name={field}
					type="text"
					className="border py-2 px-4 mb-2 w-full outline-0"
					placeholder={`Enter product ${field}...`}
					value={form[field] === 0 ? '' : form[field]}
					onChange={changeHandler}
				/>
			))}

			{error && <ErrorMessage error={error} />}

			<button
				type="submit"
				className="py-2 px-4 border bg-yellow-400 hover:text-white"
			>
				Create
			</button>
		</form>
	);
}
