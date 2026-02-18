@extends('layouts.app')
@section('title', 'Category')
@section('content')
<div class='container mx-auto px-4 py-8'><h1 class='text-2xl font-bold'>{{ $category->name }}</h1></div>
@endsection