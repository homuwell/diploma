import React from 'react';
import Container from "../../components/Container";
import Link from 'next/link'
function Index() {
    return (
        <Container>
            <h1>
                Панель администратора
            </h1>
            <Link href={"/admin/news/add"}>
                <a>Добавить новость</a>
            </Link>
            <Link href={"/admin/news/edit"}>
                <a>Изменить новость</a>
            </Link>
            <Link href={"/admin/news/delete"}>
                <a>Удалить новость</a>
            </Link>
        </Container>
    );
}

export default Index;